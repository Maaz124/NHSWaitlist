import { Header } from "@/components/ui/header";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accessibility as AccessibilityIcon, Eye, MousePointerClick, Volume2, Keyboard, CheckCircle, AlertCircle } from "lucide-react";

export default function Accessibility() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AccessibilityIcon className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Accessibility Statement</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-muted-foreground mt-4">
              Waitlist Companion™ is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </div>

          {/* Commitment */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                1. Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Waitlist Companion™ strives to ensure that our platform is accessible to all users, including those with disabilities. 
                We believe that mental health support should be available to everyone, regardless of their abilities or how they access digital content.
              </p>
              <p className="text-sm text-muted-foreground">
                We are committed to conforming to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA standards, 
                as set forth by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more 
                accessible for people with disabilities and user-friendly for everyone.
              </p>
            </CardContent>
          </Card>

          {/* Standards Compliance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Standards and Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Our accessibility efforts are guided by:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>WCAG 2.1 Level AA:</strong> We aim to meet or exceed WCAG 2.1 Level AA standards</li>
                <li><strong>UK Equality Act 2010:</strong> We comply with accessibility requirements under UK law</li>
                <li><strong>EU Web Accessibility Directive:</strong> We follow accessibility guidelines for public sector digital services</li>
                <li><strong>NHS Digital Service Standard:</strong> We align with NHS accessibility requirements for health services</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                This website is partially compliant with WCAG 2.1 Level AA. Some areas may still need improvement, 
                and we are working to address these systematically.
              </p>
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  3.1 Keyboard Navigation
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Our website can be navigated using only a keyboard:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>Use <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> to move between interactive elements</li>
                  <li>Use <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift + Tab</kbd> to navigate backwards</li>
                  <li>Use <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> or <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> to activate buttons and links</li>
                  <li>Use arrow keys to navigate through menus and lists</li>
                  <li>Use <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to close modals and menus</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  3.2 Visual Accessibility
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We provide several features to support users with visual impairments:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                  <li><strong>Color Contrast:</strong> Text and interactive elements meet WCAG contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text)</li>
                  <li><strong>Text Resizing:</strong> Content can be resized up to 200% without loss of functionality using browser zoom controls</li>
                  <li><strong>Alternative Text:</strong> Images include descriptive alt text for screen reader users</li>
                  <li><strong>Focus Indicators:</strong> Clear visible focus indicators help keyboard users see where they are on the page</li>
                  <li><strong>Responsive Design:</strong> The site works on various screen sizes and orientations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  3.3 Screen Reader Support
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Our website is compatible with screen readers including:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>NVDA (NonVisual Desktop Access)</li>
                  <li>JAWS (Job Access With Speech)</li>
                  <li>VoiceOver (macOS and iOS)</li>
                  <li>TalkBack (Android)</li>
                  <li>Other common screen reading software</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  We use semantic HTML, ARIA labels, and proper heading structure to ensure screen readers can properly 
                  interpret and navigate our content.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MousePointerClick className="w-5 h-5" />
                  3.4 Interactive Elements
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Interactive elements are designed to be accessible:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>Buttons and links have clear, descriptive labels</li>
                  <li>Form fields include associated labels and error messages</li>
                  <li>Interactive elements are large enough to easily click or tap (minimum 44x44 pixels)</li>
                  <li>Status messages and notifications are announced to screen reader users</li>
                  <li>Loading states and progress indicators are clearly indicated</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Known Issues */}
          <Card className="mb-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="w-5 h-5" />
                4. Known Accessibility Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                We are aware of some areas where we may not fully meet accessibility standards, and we are working to address these:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-2 ml-4">
                <li><strong>Third-Party Content:</strong> Some embedded content from third parties may not be fully accessible. We are working with providers to improve this.</li>
                <li><strong>PDF Documents:</strong> Some downloadable PDFs may not be fully accessible. We are converting these to accessible formats.</li>
                <li><strong>Complex Interactive Tools:</strong> Some advanced interactive tools may have limited keyboard navigation. We are continuously improving these features.</li>
                <li><strong>Video Content:</strong> Some videos may lack captions or audio descriptions. We are adding these where possible.</li>
                <li><strong>Legacy Content:</strong> Older content may not meet current accessibility standards. We are systematically reviewing and updating it.</li>
              </ul>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-4">
                If you encounter any accessibility barriers, please contact us immediately so we can address them. 
                We prioritize accessibility issues and work to resolve them as quickly as possible.
              </p>
            </CardContent>
          </Card>

          {/* Browser Compatibility */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Browser and Assistive Technology Compatibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Our website is designed to work with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Browsers</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Chrome (latest versions)</li>
                    <li>Firefox (latest versions)</li>
                    <li>Safari (latest versions)</li>
                    <li>Edge (latest versions)</li>
                    <li>Opera (latest versions)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Assistive Technologies</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
                    <li>Voice recognition software</li>
                    <li>Screen magnification tools</li>
                    <li>Switch control devices</li>
                    <li>Alternative input devices</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We recommend using the latest versions of browsers and assistive technologies for the best experience. 
                Older versions may not support all accessibility features.
              </p>
            </CardContent>
          </Card>

          {/* Alternative Access Methods */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Alternative Access Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you encounter difficulties accessing certain features of our platform, we offer alternative ways to access our services:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Email Support:</strong> Contact us at <strong>support@waitlistcompanion.com</strong> for assistance accessing content or features</li>
                <li><strong>Phone Support:</strong> Our support team can help you navigate the platform over the phone</li>
                <li><strong>Alternative Formats:</strong> We can provide information in alternative formats (large print, plain text, etc.) upon request</li>
                <li><strong>Personal Assistance:</strong> Our support team can help guide you through using the platform</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We are committed to ensuring that no user is excluded from accessing our mental health support services 
                due to accessibility barriers.
              </p>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Feedback and Reporting Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We welcome feedback on the accessibility of Waitlist Companion™. If you encounter any accessibility barriers 
                or have suggestions for improvement, please contact us:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p className="text-sm font-semibold mb-2">Accessibility Contact</p>
                <p className="text-sm text-muted-foreground mb-1">Email: <strong>accessibility@waitlistcompanion.com</strong></p>
                <p className="text-sm text-muted-foreground mb-1">General Support: <strong>support@waitlistcompanion.com</strong></p>
                <p className="text-sm text-muted-foreground mt-3">
                  When reporting an accessibility issue, please include:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>The page URL where you encountered the issue</li>
                  <li>A description of the problem</li>
                  <li>The device, browser, and assistive technology you're using</li>
                  <li>Any suggestions for improvement</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We aim to respond to accessibility feedback within 5 business days and will work with you to address 
                any issues or find alternative solutions.
              </p>
            </CardContent>
          </Card>

          {/* Continuous Improvement */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Continuous Improvement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Accessibility is an ongoing commitment, not a one-time effort. We are continuously working to improve 
                the accessibility of our platform through:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Regular Audits:</strong> We conduct regular accessibility audits using automated tools and manual testing</li>
                <li><strong>User Testing:</strong> We engage with users with disabilities to test our platform and gather feedback</li>
                <li><strong>Staff Training:</strong> Our development team receives ongoing training on accessibility best practices</li>
                <li><strong>Design Standards:</strong> All new features are designed and built with accessibility in mind from the start</li>
                <li><strong>Compliance Monitoring:</strong> We monitor our compliance with WCAG standards and update our practices accordingly</li>
                <li><strong>Community Engagement:</strong> We actively seek input from the accessibility community</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                This accessibility statement will be reviewed and updated regularly to reflect our current accessibility status 
                and improvements made.
              </p>
            </CardContent>
          </Card>

          {/* Enforcement */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Enforcement and Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Under UK law, if you believe that we have not met our accessibility obligations, you have the right to complain:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Equality and Human Rights Commission (EHRC):</strong> You can contact the EHRC if you believe we've discriminated against you</li>
                <li><strong>Legal Action:</strong> Under the Equality Act 2010, you may have legal rights if you've been discriminated against</li>
                <li><strong>NHS Complaints:</strong> If you believe this affects your NHS care, you can raise concerns through NHS complaints procedures</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We encourage you to contact us first so we can work together to resolve any accessibility issues. 
                We take accessibility complaints seriously and will investigate them promptly.
              </p>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Updates to This Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We will review and update this accessibility statement regularly to reflect:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Current accessibility status of our platform</li>
                <li>Improvements and updates we've made</li>
                <li>Any new known issues we've identified</li>
                <li>Changes in accessibility standards or regulations</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                The "Last updated" date at the top of this page indicates when the statement was last revised. 
                We recommend checking this page periodically for updates.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For questions about accessibility or to report accessibility issues, please contact us:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Waitlist Companion™ Accessibility Team</p>
                <p className="text-sm text-muted-foreground mb-1">Email: <strong>accessibility@waitlistcompanion.com</strong></p>
                <p className="text-sm text-muted-foreground mb-1">General Support: <strong>support@waitlistcompanion.com</strong></p>
                <p className="text-sm text-muted-foreground mt-3">
                  We are committed to ensuring that everyone can access the mental health support they need. 
                  Thank you for helping us improve accessibility for all users.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

