import { Link } from 'react-router-dom'
import { Calendar, Scissors, Palette, Sparkles, Star, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export default function HomePage() {
  const services = [
    {
      icon: Scissors,
      title: 'Precision Cuts',
      description: 'Expert haircuts tailored to your face shape and lifestyle',
      price: 'From $65'
    },
    {
      icon: Palette,
      title: 'Color Services',
      description: 'Professional coloring, highlights, and color correction',
      price: 'From $120'
    },
    {
      icon: Sparkles,
      title: 'Styling & Treatments',
      description: 'Special occasion styling and nourishing hair treatments',
      price: 'From $45'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Julio transformed my hair completely! The attention to detail and expertise is unmatched.'
    },
    {
      name: 'Maria Rodriguez',
      rating: 5,
      text: 'Best salon experience ever. The team is professional and the results are always perfect.'
    },
    {
      name: 'Emily Chen',
      rating: 5,
      text: 'I\'ve been coming here for years. Consistently excellent service and beautiful results.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary text-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Luxury Hair Care
              <span className="block text-secondary">Redefined</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Experience the artistry of Julio Casillas Hair Salon. Where every cut, color, 
              and style is crafted to perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/book" className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                View Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Signature Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From precision cuts to stunning color transformations, we offer comprehensive 
              hair care services tailored to your unique style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <p className="text-lg font-semibold text-secondary">{service.price}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/book">
                Book Your Service Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-foreground">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready for Your Transformation?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Book your appointment today and experience the luxury and expertise 
            that sets Julio Casillas Hair Salon apart.
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link to="/book" className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Now</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}