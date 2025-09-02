#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    PORT = 8000
    os.chdir('/home/user/webapp')
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server running on port {PORT}")
        print(f"Serving directory: {os.getcwd()}")
        sys.stdout.flush()
        httpd.serve_forever()