import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-age-gate',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show()) {
      <div class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full text-center">
          <h2 class="text-2xl font-bold mb-2">Age Verification</h2>
          <p class="text-zinc-400 mb-8">You must be 18 years or older to enter this site.</p>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              (click)="confirm(true)"
              class="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl">
              I am 18 or older
            </button>
            <button 
              (click)="confirm(false)"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl">
              I am under 18
            </button>
          </div>
          
          <p class="text-xs text-zinc-500 mt-6">By entering you agree that you are of legal smoking age in your country.</p>
        </div>
      </div>
    }
  `
})
export class AgeGateComponent {
  show = signal(!localStorage.getItem('plugyard-age-verified'));
  verified = output<boolean>();

  confirm(isAdult: boolean) {
    if (isAdult) {
      localStorage.setItem('plugyard-age-verified', 'true');
      this.show.set(false);
      this.verified.emit(true);
    } else {
      alert('Sorry, you must be 18+ to access this website.');
      window.location.href = 'https://www.google.com';
    }
  }
}