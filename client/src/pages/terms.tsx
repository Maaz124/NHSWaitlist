import { Header } from "@/components/ui/header";
import { CrisisBanner } from "@/components/ui/crisis-banner";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CreditCard, User, Shield } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-muted-foreground mt-4">
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using Waitlist Companion™ 
              operated by us. By accessing or using our service, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These Terms of Service constitute a legally binding agreement between you ("User", "you", or "your") 
                and Waitlist Companion™ ("we", "us", or "our") governing your access to and use of our mental health 
                support platform (the "Service").
              </p>
              <p className="text-sm text-muted-foreground">
                By creating an account, accessing, or using the Service, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not access 
                or use the Service.
              </p>
              <p className="text-sm text-muted-foreground">
                These Terms are governed by the laws of England and Wales, and you agree to submit to the exclusive 
                jurisdiction of the courts of England and Wales.
              </p>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                2. Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Waitlist Companion™ is a digital mental health support platform designed to provide interim support and 
                resources while users wait for NHS mental health services. Our Service includes:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Evidence-based anxiety management modules and educational content</li>
                <li>Self-help tools including mood tracking, thought records, and relaxation exercises</li>
                <li>Progress tracking and assessment tools</li>
                <li>Access to crisis support resources and information</li>
                <li>Personalized recommendations based on your input</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Important:</strong> Waitlist Companion™ is not a medical service, does not provide diagnosis or treatment, 
                and does not replace professional healthcare. The Service is designed as interim support and educational resource only.
              </p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Eligibility and Age Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To use the Service, you must:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Be at least 16 years of age</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Be responsible for maintaining the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                If you are under 18, you confirm that you have obtained parental or guardian consent to use the Service. 
                We reserve the right to verify age and may suspend or terminate accounts that violate age requirements.
              </p>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Account Registration and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                When you create an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Provide truthful, accurate, and complete registration information</li>
                <li>Maintain and update your information to keep it current</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any suspected unauthorized access</li>
                <li>Not share your account credentials with others</li>
                <li>Not create multiple accounts to circumvent restrictions</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We reserve the right to suspend or terminate accounts that provide false information, violate these Terms, 
                or engage in fraudulent or harmful activities.
              </p>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                5. Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Some features of the Service may require payment. By purchasing access, you agree to the following:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Pricing:</strong> All prices are displayed in GBP and are subject to change. We will notify you of any price changes before they take effect.</li>
                <li><strong>Payment Processing:</strong> Payments are processed securely through Stripe. We do not store your full payment card details.</li>
                <li><strong>One-Time Payments:</strong> One-time payment plans provide lifetime access to paid features. Refunds are available in accordance with our refund policy.</li>
                <li><strong>Refunds:</strong> Refund requests must be submitted within 14 days of purchase. After this period, refunds are at our discretion and may be considered on a case-by-case basis.</li>
                <li><strong>Taxes:</strong> Prices include applicable VAT where required by law.</li>
                <li><strong>Failed Payments:</strong> If payment fails, we may suspend access until payment is successfully processed.</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                All sales are final after the 14-day refund period unless otherwise stated or required by consumer protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for any illegal purpose or in violation of any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to any part of the Service, other accounts, computer systems, or networks</li>
                <li>Interfere with or disrupt the Service, servers, or networks connected to the Service</li>
                <li>Use automated systems (bots, scrapers) to access or interact with the Service without permission</li>
                <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service without written authorization</li>
                <li>Transmit any viruses, malware, or other harmful code</li>
                <li>Harass, threaten, abuse, or harm other users or our staff</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                <li>Post, upload, or transmit any content that is offensive, discriminatory, defamatory, or infringes on others' rights</li>
                <li>Use the Service to provide medical advice or diagnoses to others</li>
                <li>Reverse engineer, decompile, or attempt to extract source code from the Service</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Violations of this Acceptable Use Policy may result in immediate suspension or termination of your account 
                and may subject you to legal action.
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The Service and its original content, features, and functionality are owned by Waitlist Companion™ and 
                are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">7.1 Our Content</h3>
                <p className="text-sm text-muted-foreground">
                  All content on the Service, including text, graphics, logos, images, software, and other materials, 
                  is the property of Waitlist Companion™ or its licensors and is protected by copyright and other laws.
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">7.2 Limited License</h3>
                <p className="text-sm text-muted-foreground">
                  We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service 
                  for personal, non-commercial purposes in accordance with these Terms.
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">7.3 User Content</h3>
                <p className="text-sm text-muted-foreground">
                  You retain ownership of any content you submit, post, or display on or through the Service ("User Content"). 
                  By submitting User Content, you grant us a worldwide, royalty-free, non-exclusive license to use, store, 
                  and display your User Content solely for the purpose of providing and improving the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card className="mb-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="w-5 h-5" />
                8. Medical Disclaimer and Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
                IMPORTANT: READ THIS SECTION CAREFULLY
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                Waitlist Companion™ is designed as interim support and does NOT replace professional medical care, diagnosis, 
                or treatment. The Service provides educational content and self-help tools but is not a substitute for 
                qualified healthcare professionals.
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-2 ml-4">
                <li><strong>Not Medical Advice:</strong> The Service does not provide medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions regarding medical conditions.</li>
                <li><strong>Emergency Situations:</strong> If you are experiencing a mental health emergency, suicidal thoughts, or are in immediate danger, contact emergency services (999) immediately or go to your nearest emergency department.</li>
                <li><strong>No Guarantees:</strong> We do not guarantee specific outcomes or improvements in your mental health from using the Service.</li>
                <li><strong>Individual Results:</strong> Results and effectiveness may vary based on individual circumstances.</li>
                <li><strong>Continue NHS Care:</strong> Continue pursuing your NHS referral and attend all scheduled healthcare appointments. This Service is intended to complement, not replace, formal healthcare.</li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-yellow-300 dark:border-yellow-700">
                <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Limitation of Liability</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1 ml-4">
                  <li>Waitlist Companion™ shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Our total liability for any claims arising from your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim</li>
                  <li>We are not liable for any loss or damage arising from your reliance on information provided through the Service</li>
                  <li>We are not liable for any decisions made or actions taken based on the Service</li>
                </ul>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-4">
                  Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, 
                  fraud, or any other liability that cannot be excluded by law.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Service Availability and Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We strive to provide continuous access to the Service, but we do not guarantee uninterrupted or error-free operation. 
                The Service may be temporarily unavailable due to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Scheduled maintenance or updates</li>
                <li>Technical difficulties or system failures</li>
                <li>Circumstances beyond our reasonable control</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. 
                We may also update features, content, or functionality, which may require changes to your use of the Service.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Either party may terminate this agreement:
              </p>
              <div>
                <h3 className="font-semibold mb-2">10.1 By You</h3>
                <p className="text-sm text-muted-foreground">
                  You may terminate your account at any time by contacting us at <strong>support@waitlistcompanion.com</strong> 
                  or using the account deletion feature in your settings. Upon termination, your access will be revoked, 
                  but we may retain certain data as described in our Privacy Policy.
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">10.2 By Us</h3>
                <p className="text-sm text-muted-foreground">
                  We may suspend or terminate your account immediately, without prior notice, if:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>You breach these Terms of Service</li>
                  <li>You engage in fraudulent or harmful activities</li>
                  <li>We are required to do so by law</li>
                  <li>You fail to pay required fees</li>
                  <li>We decide to discontinue the Service</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Upon termination, your right to use the Service will immediately cease. All provisions that by their nature 
                should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>11. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You agree to indemnify, defend, and hold harmless Waitlist Companion™, its officers, directors, employees, 
                agents, and licensors from and against any claims, liabilities, damages, losses, costs, or expenses 
                (including reasonable legal fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Your use or misuse of the Service</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any rights of another party</li>
                <li>Your User Content</li>
              </ul>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>12. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms or your use 
                of the Service shall be resolved as follows:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong>Informal Resolution:</strong> We encourage you to contact us first at <strong>support@waitlistcompanion.com</strong> to resolve any issues informally</li>
                <li><strong>Mediation:</strong> If informal resolution fails, disputes may be resolved through mediation before pursuing legal action</li>
                <li><strong>Jurisdiction:</strong> Any legal proceedings shall be subject to the exclusive jurisdiction of the courts of England and Wales</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                If you are a consumer, you have legal rights under consumer protection laws that cannot be excluded. 
                Nothing in these Terms affects those rights.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>13. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending an email notification to registered users for significant changes</li>
                <li>Displaying a notice on our platform</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Your continued use of the Service after changes become effective constitutes acceptance of the updated Terms. 
                If you do not agree with the changes, you must stop using the Service and may terminate your account.
              </p>
            </CardContent>
          </Card>

          {/* Severability */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>14. Severability and Waiver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited 
                or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
              <p className="text-sm text-muted-foreground">
                Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right 
                or provision unless acknowledged and agreed to by us in writing.
              </p>
            </CardContent>
          </Card>

          {/* Entire Agreement */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>15. Entire Agreement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Waitlist Companion™ 
                regarding the Service and supersede all prior agreements and understandings, whether written or oral.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                16. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Waitlist Companion™</p>
                <p className="text-sm text-muted-foreground mb-1">Email: <strong>support@waitlistcompanion.com</strong></p>
                <p className="text-sm text-muted-foreground">Legal inquiries: <strong>legal@waitlistcompanion.com</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

