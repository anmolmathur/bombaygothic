import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('https://www.bombaygothic.com');
  const [qrCode, setQrCode] = useState('');

  const generateQRCode = () => {
    // QR Code API URL (using QR Server API)
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=200x200`;
    setQrCode(apiUrl);
  };

  // Predefined URLs
  const predefinedUrls = [
    'https://www.bombaygothic.com',
    'https://shop.bombaygothic.com'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bombay Gothic QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="w-full"
          />
          
          <div className="flex flex-wrap gap-2">
            {predefinedUrls.map((predefinedUrl) => (
              <Button
                key={predefinedUrl}
                variant="outline"
                onClick={() => setUrl(predefinedUrl)}
                className="text-sm"
              >
                {predefinedUrl.replace('https://', '')}
              </Button>
            ))}
          </div>

          <Button onClick={generateQRCode} className="w-full">
            Generate QR Code
          </Button>
        </div>

        {qrCode && (
          <div className="flex flex-col items-center gap-4">
            <img src={qrCode} alt="QR Code" className="border rounded-lg" />
            <a
              href={qrCode}
              download="qr-code.png"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Download QR Code
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;