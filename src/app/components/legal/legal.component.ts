import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/80 z-[80] backdrop-blur-sm" (click)="close.emit()"></div>

      <!-- Modal -->
      <div class="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-zinc-800">
            <h2 class="text-xl font-bold">{{ title }}</h2>
            <button (click)="close.emit()" class="text-zinc-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>

          <!-- Content -->
          <div class="p-5 overflow-y-auto text-sm text-zinc-300 leading-relaxed space-y-4">
            @if (type() === 'terms') {
              <h3 class="text-white font-semibold text-base">1. Acceptance of Terms</h3>
              <p>By accessing or using PlugYard ("the Site"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Site.</p>

              <h3 class="text-white font-semibold text-base">2. Age Restriction</h3>
              <p>You must be at least 18 years old (or the legal smoking/vaping age in your country/region) to use this website or purchase any products. By using the Site you confirm that you meet this requirement.</p>

              <h3 class="text-white font-semibold text-base">3. Products</h3>
              <p>We sell vaping products, e-liquids, bongs and related accessories. Products are intended for adult use only. We do not encourage underage use or illegal activity.</p>

              <h3 class="text-white font-semibold text-base">4. Orders & Payment</h3>
              <p>All orders are subject to availability and confirmation. Prices are listed in the currency shown on the site. You are responsible for providing accurate delivery information.</p>

              <h3 class="text-white font-semibold text-base">5. Shipping & Delivery</h3>
              <p>Delivery times are estimates only. We are not responsible for delays caused by the courier or customs. Discreet packaging is used where possible.</p>

              <h3 class="text-white font-semibold text-base">6. Returns & Refunds</h3>
              <p>Due to the nature of the products, opened or used items generally cannot be returned for hygiene and safety reasons. Contact us if you receive a damaged or incorrect item.</p>

              <h3 class="text-white font-semibold text-base">7. Limitation of Liability</h3>
              <p>PlugYard is not liable for any misuse of products, health effects, or damages arising from use of the Site or products. Use products at your own risk and in accordance with local laws.</p>

              <h3 class="text-white font-semibold text-base">8. Changes</h3>
              <p>We may update these Terms at any time. Continued use of the Site means you accept the updated Terms.</p>

              <p class="text-zinc-500 text-xs pt-4">Last updated: August 2026</p>
            }

            @if (type() === 'privacy') {
              <h3 class="text-white font-semibold text-base">1. Information We Collect</h3>
              <p>When you place an order we may collect your name, email, phone number and delivery address. This information is used only to process and deliver your order.</p>

              <h3 class="text-white font-semibold text-base">2. How We Use Your Information</h3>
              <p>We use your details to:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Process and fulfil orders</li>
                <li>Contact you about your order</li>
                <li>Improve our service</li>
              </ul>

              <h3 class="text-white font-semibold text-base">3. Sharing of Information</h3>
              <p>We do not sell your personal information. We only share it with delivery partners or payment services when necessary to complete your order.</p>

              <h3 class="text-white font-semibold text-base">4. Cookies</h3>
              <p>The Site may use basic cookies or local storage (for example to remember your cart). You can clear these in your browser settings.</p>

              <h3 class="text-white font-semibold text-base">5. Data Security</h3>
              <p>We take reasonable steps to protect your information, but no method of transmission over the internet is 100% secure.</p>

              <h3 class="text-white font-semibold text-base">6. Your Rights</h3>
              <p>You may request access to, correction of, or deletion of your personal data by contacting us.</p>

              <h3 class="text-white font-semibold text-base">7. Contact</h3>
              <p>For any privacy-related questions, contact us through the details provided on the Site.</p>

              <p class="text-zinc-500 text-xs pt-4">Last updated: August 2026</p>
            }

            @if (type() === 'disclaimer') {
              <h3 class="text-white font-semibold text-base">Age Restriction</h3>
              <p>This website and all products sold are intended for adults only. You must be 18+ (or the legal age in your jurisdiction) to enter and purchase.</p>

              <h3 class="text-white font-semibold text-base">Health Warning</h3>
              <p>Vaping and smoking products contain nicotine and other substances that can be addictive and may be harmful to health. Keep all products away from children and pets.</p>

              <h3 class="text-white font-semibold text-base">Legal Compliance</h3>
              <p>It is your responsibility to ensure that purchasing and using these products is legal in your country or region. PlugYard is not responsible for any violation of local laws.</p>

              <h3 class="text-white font-semibold text-base">No Medical Claims</h3>
              <p>Nothing on this website is intended as medical advice. Consult a doctor if you have health concerns related to nicotine or smoking products.</p>

              <h3 class="text-white font-semibold text-base">Product Use</h3>
              <p>Use all products only as intended. Misuse can be dangerous. We accept no liability for improper use.</p>

              <p class="text-zinc-500 text-xs pt-4">By using this site you acknowledge that you have read and understood this disclaimer.</p>
            }
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-zinc-800">
            <button 
              (click)="close.emit()"
              class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition">
              Close
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class LegalComponent {
  isOpen = input(false);
  type = input<'terms' | 'privacy' | 'disclaimer'>('terms');
  close = output<void>();

  get title(): string {
    const titles = {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      disclaimer: 'Age & Legal Disclaimer'
    };
    return titles[this.type()];
  }
}