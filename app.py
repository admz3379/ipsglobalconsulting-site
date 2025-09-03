#!/usr/bin/env python3
"""
iPS Global Consulting - Backend Email Server
Simple Flask server that handles contact form and chatbot submissions
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import datetime
import os
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Email configuration - using Gmail SMTP (you can change this)
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'info@ipsglobalconsulting.com'  # This will be in the "From" field
SENDER_PASSWORD = 'your-app-password'  # You'll need to set up an App Password
RECIPIENT_EMAIL = 'info@ipsglobalconsulting.com'

def send_email(subject, body, is_html=True):
    """Send email using SMTP"""
    try:
        # Create message
        message = MIMEMultipart('alternative')
        message['From'] = SENDER_EMAIL
        message['To'] = RECIPIENT_EMAIL
        message['Subject'] = subject
        
        # Create HTML and plain text versions
        if is_html:
            html_part = MIMEText(body, 'html')
            message.attach(html_part)
        else:
            text_part = MIMEText(body, 'plain')
            message.attach(text_part)
        
        # For now, we'll use a simple approach without SMTP authentication
        # This will create a local email file that you can see
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        email_file = f"/home/user/webapp/emails/email_{timestamp}.txt"
        
        # Create emails directory if it doesn't exist
        os.makedirs('/home/user/webapp/emails', exist_ok=True)
        
        # Save email to file (for testing without SMTP)
        with open(email_file, 'w') as f:
            f.write(f"To: {RECIPIENT_EMAIL}\n")
            f.write(f"Subject: {subject}\n")
            f.write(f"Timestamp: {datetime.datetime.now()}\n")
            f.write("-" * 50 + "\n")
            f.write(body)
        
        print(f"Email saved to: {email_file}")
        return True, f"Email saved to {email_file}"
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        traceback.print_exc()
        return False, str(e)

@app.route('/')
def serve_index():
    """Serve the main website"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        # Extract form data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        company = data.get('company', 'Not provided').strip()
        service = data.get('service', 'General Consultation').strip()
        message = data.get('message', '').strip()
        
        # Validate required fields
        if not name or not email or not message:
            return jsonify({
                'success': False,
                'error': 'Please fill in all required fields (Name, Email, Message)'
            }), 400
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'error': 'Please enter a valid email address'
            }), 400
        
        # Create email content
        subject = f"New Contact Form Submission - {name}"
        
        # HTML email body
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .header {{ background-color: #1E3A8A; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #1E3A8A; }}
                .value {{ margin-left: 10px; }}
                .message-box {{ background-color: #f8f9fa; border-left: 4px solid #1E3A8A; padding: 15px; margin: 20px 0; }}
                .footer {{ background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h2>New Contact Form Submission</h2>
                <p>iPS Global Consulting Website</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <span class="label">From:</span>
                    <span class="value">{name} &lt;{email}&gt;</span>
                </div>
                
                <div class="field">
                    <span class="label">Company/Organization:</span>
                    <span class="value">{company}</span>
                </div>
                
                <div class="field">
                    <span class="label">Service Interest:</span>
                    <span class="value">{service}</span>
                </div>
                
                <div class="message-box">
                    <div class="label">Message:</div>
                    <div style="margin-top: 10px;">{message.replace(chr(10), '<br>')}</div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Submission Details:</strong></p>
                <p>Source: Website Contact Form</p>
                <p>Timestamp: {datetime.datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                <p>This message was automatically generated from the iPS Global Consulting website contact system.</p>
            </div>
        </body>
        </html>
        """
        
        # Send email
        success, result = send_email(subject, html_body, is_html=True)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Thank you for your inquiry! We have received your message and will respond within 24 hours.',
                'debug': result
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Sorry, there was an error processing your request. Please try again or email us directly at info@ipsglobalconsulting.com',
                'debug': result
            }), 500
            
    except Exception as e:
        print(f"Error in contact form handler: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'Server error occurred. Please try again later.',
            'debug': str(e)
        }), 500

@app.route('/api/chatbot', methods=['POST'])
def handle_chatbot():
    """Handle chatbot submissions"""
    try:
        data = request.get_json()
        
        # Extract chatbot data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        company = data.get('company', 'Not provided').strip()
        service = data.get('service', 'General Consultation').strip()
        message = data.get('message', '').strip()
        session_id = data.get('session_id', 'unknown')
        
        # Validate required fields
        if not name or not email or not message:
            return jsonify({
                'success': False,
                'error': 'Missing required information from chatbot conversation'
            }), 400
        
        # Create email content
        subject = f"New AI Chatbot Inquiry - {name}"
        
        # HTML email body
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .header {{ background-color: #059669; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #059669; }}
                .value {{ margin-left: 10px; }}
                .message-box {{ background-color: #f0f9ff; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; }}
                .chatbot-info {{ background-color: #f8f9fa; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px; }}
                .footer {{ background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h2>🤖 New AI Chatbot Inquiry</h2>
                <p>iPS Global Consulting Website</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <span class="label">From:</span>
                    <span class="value">{name} &lt;{email}&gt;</span>
                </div>
                
                <div class="field">
                    <span class="label">Company/Organization:</span>
                    <span class="value">{company}</span>
                </div>
                
                <div class="field">
                    <span class="label">Service Interest:</span>
                    <span class="value">{service}</span>
                </div>
                
                <div class="message-box">
                    <div class="label">Customer Message:</div>
                    <div style="margin-top: 10px;">{message.replace(chr(10), '<br>')}</div>
                </div>
                
                <div class="chatbot-info">
                    <h4 style="margin-top: 0; color: #059669;">AI Chatbot Session Details:</h4>
                    <p><strong>Session ID:</strong> {session_id}</p>
                    <p><strong>Interaction Type:</strong> AI-guided consultation</p>
                    <p><strong>Lead Quality:</strong> High (completed full conversation flow)</p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Submission Details:</strong></p>
                <p>Source: AI Chatbot Conversation</p>
                <p>Timestamp: {datetime.datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                <p>This inquiry was generated through the interactive AI chatbot on the iPS Global Consulting website.</p>
            </div>
        </body>
        </html>
        """
        
        # Send email
        success, result = send_email(subject, html_body, is_html=True)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Perfect! Your information has been successfully sent to our team. We will be in touch within 24 hours!',
                'debug': result
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Sorry, there was an issue processing your request. Please try again or email us directly at info@ipsglobalconsulting.com',
                'debug': result
            }), 500
            
    except Exception as e:
        print(f"Error in chatbot handler: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'Server error occurred. Please try again later.',
            'debug': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now().isoformat(),
        'service': 'iPS Global Consulting Backend'
    })

if __name__ == '__main__':
    print("Starting iPS Global Consulting Backend Server...")
    print("Email system: File-based (for testing)")
    print("Access URLs:")
    print("  - Website: http://localhost:5000")
    print("  - Contact API: http://localhost:5000/api/contact")
    print("  - Chatbot API: http://localhost:5000/api/chatbot")
    print("  - Health Check: http://localhost:5000/api/health")
    
    app.run(host='0.0.0.0', port=5000, debug=True)