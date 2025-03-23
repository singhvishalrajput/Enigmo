# Enigmo

A secure encryption application for protecting your sensitive text, PDFs, and audio files with a unique two-factor encryption system.

## Features

- **Two-factor encryption**: Uses both a system-generated keyword and a user-provided password
- **Multiple file format support**: 
  - Text encryption/decryption
  - PDF document encryption/decryption
  - Audio file encryption/decryption (MP3, WAV)
- **User-friendly interface**: Clean, intuitive design for easy navigation
- **Secure XOR cipher implementation**: Simple yet effective encryption algorithm

## Technologies Used

- **Frontend**: React.js
- **Backend**: Flask (Python)
- **Styling**: Custom CSS with responsive design
- **File Processing**: 
  - PyMuPDF for PDF handling
  - Wave for audio processing

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.6+
- Flask and required Python packages

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Enigmo.git
cd Enigmo
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server
```bash
cd backend
python app.py
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. Enter your name and email to generate a unique system keyword
2. Choose between encrypting or decrypting
3. Select your input type (text, PDF, or audio)
4. Enter your secret keyword (this is your second encryption factor)
5. Submit your data or file for processing
6. Download or copy the result

## Security Note

Enigmo uses a simple XOR cipher for educational purposes. While effective for casual security needs, consider industry-standard encryption algorithms for highly sensitive information.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for simple, accessible encryption tools