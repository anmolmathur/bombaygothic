import qrcode
from tkinter import *
from tkinter import messagebox
from PIL import Image, ImageTk
import os
from datetime import datetime

class QRCodeGenerator:
    def __init__(self, root):
        self.root = root
        self.root.geometry('800x600')
        self.root.title('Bombay Gothic QR Code Generator')
        
        # Predefined URLs
        self.predefined_urls = [
            'https://www.bombaygothic.com',
            'https://shop.bombaygothic.com'
        ]
        
        # Create GUI elements
        self.setup_gui()
        
        # Store the current PhotoImage
        self.current_image = None
        
    def setup_gui(self):
        # Main container
        main_frame = Frame(self.root)
        main_frame.pack(padx=20, pady=20, fill=BOTH, expand=True)
        
        # URL input
        Label(main_frame, text='Enter URL:', font=('Arial', 12)).pack(pady=10)
        self.url_entry = Entry(main_frame, width=50)
        self.url_entry.pack(pady=5)
        
        # Predefined URL buttons
        predefined_frame = Frame(main_frame)
        predefined_frame.pack(pady=10)
        
        for url in self.predefined_urls:
            Button(
                predefined_frame, 
                text=url.replace('https://', ''),
                command=lambda u=url: self.set_url(u)
            ).pack(side=LEFT, padx=5)
        
        # Generate button
        Button(
            main_frame, 
            text='Generate QR Code',
            command=self.generate_qr,
            bg='#4CAF50',
            fg='white',
            font=('Arial', 12)
        ).pack(pady=20)
        
        # QR Code display label
        self.qr_label = Label(main_frame)
        self.qr_label.pack(pady=10)
        
        # Status label
        self.status_label = Label(main_frame, text='', font=('Arial', 10))
        self.status_label.pack(pady=10)
    
    def set_url(self, url):
        self.url_entry.delete(0, END)
        self.url_entry.insert(0, url)
        
    def generate_qr(self):
        url = self.url_entry.get().strip()
        
        if not url:
            messagebox.showerror('Error', 'Please enter a URL')
            return
            
        try:
            # Create QR code instance
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            
            # Add data
            qr.add_data(url)
            qr.make(fit=True)
            
            # Create image
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Create 'qrcodes' directory if it doesn't exist
            if not os.path.exists('qrcodes'):
                os.makedirs('qrcodes')
            
            # Generate filename based on URL and timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"qrcodes/qr_{url.replace('https://', '').replace('/', '_')}_{timestamp}.png"
            
            # Save image
            qr_image.save(filename)
            
            # Display the QR code in the GUI
            # Convert PIL image to PhotoImage
            pil_image = qr_image.resize((300, 300))  # Resize for display
            self.current_image = ImageTk.PhotoImage(pil_image)
            self.qr_label.config(image=self.current_image)
            
            self.status_label.config(
                text=f'QR Code saved as: {filename}',
                fg='green'
            )
            
        except Exception as e:
            messagebox.showerror('Error', f'An error occurred: {str(e)}')
            self.status_label.config(
                text='Failed to generate QR code',
                fg='red'
            )

if __name__ == '__main__':
    # Set up the requirements first
    print("Please ensure you have installed required packages:")
    print("Run: pip3 install qrcode pillow")
    
    # Create and run the application
    root = Tk()
    app = QRCodeGenerator(root)
    root.mainloop()