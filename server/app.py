from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import wave
import io
import random
import base64
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import fitz  # PyMuPDF

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Function to generate a unique keyword based on name & email
def generate_keyword(name, email):
    if not name or not email:
        return None

    # Convert characters to ASCII values and sum them up
    name_ascii_sum = sum(ord(char) for char in name)
    email_ascii_sum = sum(ord(char) for char in email)

    # Generate keyword using ASCII sum and a prime multiplier
    keyword = str((name_ascii_sum + email_ascii_sum) * 37)

    return keyword

# Function to generate the final encryption key
def get_final_key(keyword, userKeyword):
    key1 = sum(ord(char) for char in keyword)  # Convert generated keyword to ASCII sum
    key2 = sum(ord(char) for char in userKeyword)  # Convert user-provided keyword to ASCII sum
    return (key1 ^ key2) % 256  # XOR both sums and ensure it's in 0-255 range

# Simplified and more reliable encryption function
def encrypt_text(text, key):
    # Convert text to bytes
    text_bytes = text.encode('utf-8')
    
    # XOR each byte with the key
    encrypted_bytes = bytearray()
    for byte in text_bytes:
        encrypted_bytes.append((byte ^ key))
    
    # Add a marker to indicate this is encrypted text
    marker = "ENCRYPTED:"
    
    # Convert to base64 for safe storage/transmission
    encoded = base64.b64encode(encrypted_bytes).decode('utf-8')
    
    return marker + encoded

# Simplified and more reliable decryption function
def decrypt_text(encrypted_text, key):
    try:
        # Check for marker
        marker = "ENCRYPTED:"
        if not encrypted_text.startswith(marker):
            return "Error: This doesn't appear to be encrypted text"
        
        # Remove marker
        encoded = encrypted_text[len(marker):]
        
        # Decode from base64
        encrypted_bytes = base64.b64decode(encoded)
        
        # XOR each byte with the key
        decrypted_bytes = bytearray()
        for byte in encrypted_bytes:
            decrypted_bytes.append((byte ^ key))
        
        # Convert back to string
        return decrypted_bytes.decode('utf-8')
    except Exception as e:
        return f"Decryption error: {str(e)}"

# Function to extract text from PDF with formatting information
def extract_pdf_content(file_path):
    doc = fitz.open(file_path)
    content = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Extract text with formatting
        blocks = page.get_text("dict")["blocks"]
        page_text = ""
        
        for block in blocks:
            if "lines" in block:
                for line in block["lines"]:
                    for span in line["spans"]:
                        page_text += span["text"] + " "
                    page_text += "\n"
                page_text += "\n"
        
        content.append(page_text)
    
    doc.close()
    return content

# Function to encrypt PDF content
def encrypt_pdf(file_path, key):
    try:
        # Extract content from the PDF
        content_by_pages = extract_pdf_content(file_path)
        
        # Encrypt each page's content
        encrypted_content = []
        for page_content in content_by_pages:
            encrypted_page = encrypt_text(page_content, key)
            encrypted_content.append(encrypted_page)
        
        # Create a new PDF with the encrypted content
        output_path = file_path.replace(".pdf", "_encrypted.pdf")
        
        # Generate the encrypted PDF
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72, leftMargin=72,
            topMargin=72, bottomMargin=18
        )
        
        styles = getSampleStyleSheet()
        story = []
        
        # Create a custom style for the encrypted text
        encr_style = ParagraphStyle(
            'EncryptedText',
            parent=styles['Normal'],
            fontSize=10,
            leading=12,
            wordWrap='CJK'
        )
        
        # Add encrypted content to the PDF
        for enc_page in encrypted_content:
            # Split long encrypted content into chunks to avoid overflow
            chunks = [enc_page[i:i+100] for i in range(0, len(enc_page), 100)]
            for chunk in chunks:
                p = Paragraph(chunk, encr_style)
                story.append(p)
            story.append(Spacer(1, 0.2*inch))
            
        doc.build(story)
        
        return output_path
    except Exception as e:
        print(f"Error in encrypt_pdf: {str(e)}")
        raise

# Function to decrypt a PDF
def decrypt_pdf(file_path, key):
    try:
        doc = fitz.open(file_path)
        encrypted_content = []
        
        # Extract the encrypted content from each page
        for page_num in range(len(doc)):
            page = doc[page_num]
            encrypted_content.append(page.get_text())
        
        # Decrypt each page's content
        decrypted_content = []
        for enc_text in encrypted_content:
            decrypted_text = decrypt_text(enc_text, key)
            decrypted_content.append(decrypted_text)
        
        # Create a new PDF with the decrypted content
        output_path = file_path.replace("_encrypted.pdf", "_decrypted.pdf")
        if not output_path.endswith("_decrypted.pdf"):
            output_path = file_path.replace(".pdf", "_decrypted.pdf")
        
        # Generate the decrypted PDF
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72, leftMargin=72,
            topMargin=72, bottomMargin=18
        )
        
        styles = getSampleStyleSheet()
        story = []
        
        # Add decrypted content to the PDF
        for dec_page in decrypted_content:
            if not dec_page.startswith("Error:"):
                # Replace newlines with HTML line breaks for proper formatting
                p = Paragraph(dec_page.replace('\n', '<br/>'), styles['Normal'])
                story.append(p)
                story.append(Spacer(1, 0.2*inch))
            else:
                # Error message
                p = Paragraph(f"<b>{dec_page}</b>", styles['Normal'])
                story.append(p)
            
        doc.build(story)
        
        return output_path
    except Exception as e:
        print(f"Error in decrypt_pdf: {str(e)}")
        raise

# Function to encrypt audio file (WAV format)
def encrypt_audio(file_path, key):
    try:
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.mp3':
            # For MP3 files, we'll use a direct byte modification approach
            with open(file_path, 'rb') as f:
                audio_bytes = bytearray(f.read())
            
            # XOR each byte with the key
            for i in range(len(audio_bytes)):
                audio_bytes[i] = audio_bytes[i] ^ key
            
            # Create output path
            output_path = file_path.replace(".mp3", "_encrypted.mp3")
            
            # Write the encrypted bytes back to a file
            with open(output_path, 'wb') as f:
                f.write(audio_bytes)
                
        elif file_extension == '.wav':
            # For WAV files, we'll preserve the header
            with wave.open(file_path, 'rb') as wf:
                n_channels = wf.getnchannels()
                sample_width = wf.getsampwidth()
                frame_rate = wf.getframerate()
                audio_frames = bytearray(wf.readframes(wf.getnframes()))
            
            # XOR each byte with the key
            for i in range(len(audio_frames)):
                audio_frames[i] = audio_frames[i] ^ key
            
            # Create output path
            output_path = file_path.replace(".wav", "_encrypted.wav")
            
            # Write the encrypted bytes back to a WAV file
            with wave.open(output_path, 'wb') as wf:
                wf.setnchannels(n_channels)
                wf.setsampwidth(sample_width)
                wf.setframerate(frame_rate)
                wf.writeframes(audio_frames)
        else:
            raise ValueError(f"Unsupported audio format: {file_extension}")
        
        return output_path
    except Exception as e:
        print(f"Error in encrypt_audio: {str(e)}")
        raise

# Function to decrypt audio file
def decrypt_audio(file_path, key):
    try:
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if "_encrypted.mp3" in file_path.lower() or file_extension == '.mp3':
            # For MP3 files
            with open(file_path, 'rb') as f:
                audio_bytes = bytearray(f.read())
            
            # XOR each byte with the key (same operation as encryption)
            for i in range(len(audio_bytes)):
                audio_bytes[i] = audio_bytes[i] ^ key
            
            # Create output path
            if "_encrypted.mp3" in file_path:
                output_path = file_path.replace("_encrypted.mp3", "_decrypted.mp3")
            else:
                output_path = file_path.replace(".mp3", "_decrypted.mp3")
            
            # Write the decrypted bytes back to a file
            with open(output_path, 'wb') as f:
                f.write(audio_bytes)
                
        elif "_encrypted.wav" in file_path.lower() or file_extension == '.wav':
            # For WAV files
            with wave.open(file_path, 'rb') as wf:
                n_channels = wf.getnchannels()
                sample_width = wf.getsampwidth()
                frame_rate = wf.getframerate()
                audio_frames = bytearray(wf.readframes(wf.getnframes()))
            
            # XOR each byte with the key
            for i in range(len(audio_frames)):
                audio_frames[i] = audio_frames[i] ^ key
            
            # Create output path
            if "_encrypted.wav" in file_path:
                output_path = file_path.replace("_encrypted.wav", "_decrypted.wav")
            else:
                output_path = file_path.replace(".wav", "_decrypted.wav")
            
            # Write the decrypted bytes back to a WAV file
            with wave.open(output_path, 'wb') as wf:
                wf.setnchannels(n_channels)
                wf.setsampwidth(sample_width)
                wf.setframerate(frame_rate)
                wf.writeframes(audio_frames)
        else:
            raise ValueError(f"Unsupported audio format: {file_extension}")
        
        return output_path
    except Exception as e:
        print(f"Error in decrypt_audio: {str(e)}")
        raise

@app.route('/download', methods=['GET'])
def download_file():
    try:
        file_path = request.args.get('path')
        
        # Security check to prevent directory traversal attacks
        if not file_path or '..' in file_path or not os.path.exists(file_path):
            return jsonify({"success": False, "message": "Invalid file path"}), 400
            
        # Get the filename from the path
        filename = os.path.basename(file_path)
        
        # Send the file to the client
        return send_file(file_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/generate-keyword', methods=['POST'])
def generate_keyword_route():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")

        keyword = generate_keyword(name, email)
        if keyword:
            return jsonify({"success": True, "keyword": keyword})
        else:
            return jsonify({"success": False, "message": "Invalid input"}), 400

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/process', methods=['POST'])
def process_request():
    try:
        action = request.form.get("action")
        keyword = request.form.get("keyword")
        userKeyword = request.form.get("userKeyword")
        file = request.files.get("file")
        text = request.form.get("text")

        if not keyword or not userKeyword:
            return jsonify({"success": False, "message": "Missing keyword"}), 400

        # Generate final encryption key
        final_key = get_final_key(keyword, userKeyword)

        if file:
            # Create uploads directory if it doesn't exist
            if not os.path.exists("uploads"):
                os.makedirs("uploads")
                
            # Save file temporarily
            file_path = os.path.join("uploads", file.filename)
            file.save(file_path)
            
            # Check the file type based on extension
            file_extension = os.path.splitext(file_path)[1].lower()
            
            # Process audio files
            if file_extension in ['.mp3', '.wav']:
                if action == "encrypt":
                    encrypted_file_path = encrypt_audio(file_path, final_key)
                    # Return file information for download
                    return jsonify({
                        "success": True, 
                        "message": "Audio encrypted successfully",
                        "result": f"Audio encrypted successfully. Your file is ready for download.",
                        "fileUrl": f"/download?path={encrypted_file_path}"
                    })
                elif action == "decrypt":
                    decrypted_file_path = decrypt_audio(file_path, final_key)
                    # Return file information for download
                    return jsonify({
                        "success": True, 
                        "message": "Audio decrypted successfully",
                        "result": f"Audio decrypted successfully. Your file is ready for download.",
                        "fileUrl": f"/download?path={decrypted_file_path}"
                    })
            # Process PDF files
            elif file_extension == '.pdf':
                if action == "encrypt":
                    encrypted_file_path = encrypt_pdf(file_path, final_key)
                    # Return file information for download
                    return jsonify({
                        "success": True, 
                        "message": "File encrypted successfully",
                        "result": f"PDF encrypted successfully. Your file is ready for download.",
                        "fileUrl": f"/download?path={encrypted_file_path}"
                    })
                elif action == "decrypt":
                    decrypted_file_path = decrypt_pdf(file_path, final_key)
                    # Return file information for download
                    return jsonify({
                        "success": True, 
                        "message": "File decrypted successfully",
                        "result": f"PDF decrypted successfully. Your file is ready for download.",
                        "fileUrl": f"/download?path={decrypted_file_path}"
                    })
            else:
                return jsonify({"success": False, "message": "Unsupported file type"}), 400

        elif text:
            if action == "encrypt":
                encrypted_text = encrypt_text(text, final_key)
                return jsonify({"success": True, "message": "Text encrypted successfully", "result": encrypted_text})
            elif action == "decrypt":
                decrypted_text = decrypt_text(text, final_key)
                return jsonify({"success": True, "message": "Text decrypted successfully", "result": decrypted_text})

        return jsonify({"success": False, "message": "Invalid input"}), 400

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists("uploads"):
        os.makedirs("uploads")  # Create folder for file uploads
    app.run(debug=True)