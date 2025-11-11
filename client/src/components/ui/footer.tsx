import { Shield, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Emergency Banner */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-destructive flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Emergency Support</h3>
              <p className="text-sm text-destructive/80">
                If you're having thoughts of suicide or self-harm, please contact emergency services immediately:
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <span className="font-medium">Emergency: 999</span>
                <span className="font-medium">Samaritans: 116 123</span>
                <span className="font-medium">Crisis Text Line: Text SHOUT to 85258</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.svg" 
                alt="Waitlist Companion Logo" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Providing interim mental health support while you wait for NHS services. 
              Evidence-based tools and resources to help you manage anxiety and improve wellbeing.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Clinically informed support</span>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support Resources</h3>
            <div className="space-y-2 text-sm">
              <a 
                href="https://www.nhs.uk/mental-health/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                NHS Mental Health Services <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://www.samaritans.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                Samaritans <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://www.mind.org.uk/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                Mind UK <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://www.anxietyuk.org.uk/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                Anxiety UK <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Get Help</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>24/7 Crisis Line: 116 123</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@waitlistcompanion.com</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                For technical support or general inquiries about the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="border-t pt-8 space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Medical Disclaimer</h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-2">
              <p>
                <strong>Important:</strong> Waitlist Companion™ is designed as interim support and does not replace professional medical care. 
                This platform provides educational content and self-help tools but is not a substitute for diagnosis, treatment, or medical advice from qualified healthcare professionals.
              </p>
              <p>
                <strong>Emergency Situations:</strong> If you are experiencing a mental health emergency, suicidal thoughts, or are in immediate danger, 
                please contact emergency services (999) or go to your nearest emergency department immediately.
              </p>
              <p>
                <strong>NHS Transition:</strong> Continue to pursue your NHS referral and attend all scheduled appointments. 
                This platform is intended to provide support while you wait for formal NHS mental health services.
              </p>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t text-xs text-muted-foreground">
            <div className="mb-2 sm:mb-0">
              © 2025 Waitlist Companion™. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-primary transition-colors">
                Accessibility
              </Link>
            </div>
          </div>

          {/* Regulatory Compliance */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <p className="mb-1">
              <strong>Regulatory Information:</strong> This platform complies with UK healthcare data protection standards and GDPR requirements. 
              All user data is handled in accordance with NHS Digital guidance for digital health services.
            </p>
            <p>
              Not regulated as a medical device. Content developed in consultation with mental health professionals and based on NICE guidelines for anxiety management.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}