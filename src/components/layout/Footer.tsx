import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Salon Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Julio Casillas Hair Salon</h3>
            <p className="text-primary-foreground/80 mb-4">
              Experience luxury hair care with our expert stylists. We specialize in cuts, color, 
              styling, and treatments that bring out your natural beauty.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="text-sm text-primary-foreground/80">
                  123 Beauty Street<br />
                  Los Angeles, CA 90210
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="text-sm text-primary-foreground/80">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-secondary" />
                <span className="text-sm text-primary-foreground/80">info@juliocasillas.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-secondary" />
                <div className="text-sm text-primary-foreground/80">
                  <div>Mon - Fri: 9:00 AM - 7:00 PM</div>
                  <div>Saturday: 8:00 AM - 6:00 PM</div>
                  <div>Sunday: 10:00 AM - 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 Julio Casillas Hair Salon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}