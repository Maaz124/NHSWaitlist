import { Header } from "@/components/ui/header";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-muted-foreground mt-4">
              Waitlist Companion™ is committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Waitlist Companion™ ("we", "us", or "our") operates a mental health support platform designed to provide 
                interim support while users wait for NHS mental health services. This Privacy Policy applies to all users 
                of our website and services.
              </p>
              <p className="text-sm text-muted-foreground">
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                We are committed to complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                2. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">2.1 Personal Information</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We may collect personal information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Date of birth and demographic information</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Health-related information you choose to share through assessments and tools</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">2.2 Usage Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We automatically collect certain information when you use our services:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2.3 Health Information</h3>
                <p className="text-sm text-muted-foreground">
                  As a mental health platform, we may collect sensitive health information that you voluntarily provide, 
                  such as mood assessments, anxiety levels, progress tracking data, and responses to questionnaires. 
                  This information is treated with the highest level of confidentiality.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our mental health support services</li>
                <li><strong>Personalization:</strong> To customize your experience and provide relevant content and tools</li>
                <li><strong>Progress Tracking:</strong> To help you track your mental health progress and access historical data</li>
                <li><strong>Communication:</strong> To respond to your inquiries, send service updates, and provide support</li>
                <li><strong>Payment Processing:</strong> To process payments and manage your subscription</li>
                <li><strong>Analytics:</strong> To analyze usage patterns and improve our platform (using anonymized data)</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
                <li><strong>Safety:</strong> To ensure platform safety and prevent misuse</li>
              </ul>
            </CardContent>
          </Card>

          {/* Legal Basis for Processing */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Legal Basis for Processing (UK GDPR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Under UK GDPR, we process your personal data based on the following legal bases:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Consent:</strong> When you provide explicit consent for specific processing activities</li>
                <li><strong>Contract Performance:</strong> To fulfill our contract with you and provide the services you've requested</li>
                <li><strong>Legitimate Interests:</strong> For platform improvement, security, and fraud prevention</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                <li><strong>Vital Interests:</strong> To protect your or others' life, physical safety, or health in emergency situations</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Special Category Data:</strong> Health information is classified as special category data under UK GDPR. 
                We process this data based on explicit consent and, where applicable, to provide health or social care services.
              </p>
            </CardContent>
          </Card>

          {/* Data Sharing and Disclosure */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers (e.g., Stripe for payments, hosting providers) who assist in operating our platform</li>
                <li><strong>Emergency Situations:</strong> If we believe it's necessary to protect your or others' safety, including sharing information with emergency services or crisis support organizations</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with prior notice)</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>NHS Integration:</strong> We do not automatically share your data with the NHS. Any sharing with healthcare providers 
                would only occur with your explicit consent and in accordance with applicable healthcare data protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                6. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Encryption of data in transit (HTTPS/TLS) and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>Secure payment processing through PCI-compliant payment providers</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Your Rights Under UK GDPR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of how we process your data</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
                <li><strong>Right to Complain:</strong> Lodge a complaint with the Information Commissioner's Office (ICO)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise these rights, please contact us at <strong>privacy@waitlistcompanion.com</strong>. 
                We will respond to your request within one month.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. Specifically:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Account information is retained while your account is active and for up to 7 years after account closure for legal and regulatory purposes</li>
                <li>Health-related data may be retained for longer periods if required for your care continuity</li>
                <li>Payment records are retained in accordance with financial regulations (typically 7 years)</li>
                <li>Anonymized analytics data may be retained indefinitely</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                You can request deletion of your account and associated data at any time through your account settings or by contacting us directly.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use cookies and similar tracking technologies to enhance your experience. Cookies are small data files stored on your device. 
                We use cookies for:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Authentication and session management</li>
                <li>Remembering your preferences</li>
                <li>Analyzing usage patterns (anonymized)</li>
                <li>Improving platform functionality</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                You can control cookies through your browser settings. However, disabling certain cookies may affect platform functionality.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your information is primarily processed and stored within the UK and European Economic Area (EEA). 
                If we transfer data outside the UK/EEA, we ensure appropriate safeguards are in place, such as:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Standard Contractual Clauses approved by UK/EU authorities</li>
                <li>Adequacy decisions by relevant data protection authorities</li>
                <li>Other legally recognized transfer mechanisms</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>11. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our services are intended for users aged 16 and over. We do not knowingly collect personal information from children under 16. 
                If we become aware that we have collected information from a child under 16, we will take steps to delete that information promptly.
              </p>
              <p className="text-sm text-muted-foreground">
                If you are a parent or guardian and believe your child has provided us with personal information, 
                please contact us immediately at <strong>privacy@waitlistcompanion.com</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>12. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending an email notification for significant changes</li>
                <li>Displaying a notice on our platform</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>13. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Waitlist Companion™ Data Protection Officer</p>
                <p className="text-sm text-muted-foreground mb-1">Email: <strong>privacy@waitlistcompanion.com</strong></p>
                <p className="text-sm text-muted-foreground mb-1">Support: <strong>support@waitlistcompanion.com</strong></p>
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>Information Commissioner's Office (ICO)</strong><br />
                  If you wish to lodge a complaint about our data handling practices, you can contact the ICO:<br />
                  Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a><br />
                  Phone: 0303 123 1113
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">Important Medical Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Waitlist Companion™ is designed as interim support and does not replace professional medical care. 
                This platform provides educational content and self-help tools but is not a substitute for diagnosis, 
                treatment, or medical advice from qualified healthcare professionals. If you are experiencing a mental health emergency, 
                please contact emergency services (999) immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

