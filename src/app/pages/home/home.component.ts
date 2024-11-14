import { Component, HostListener } from '@angular/core';
import { ReserveCardComponent } from '../../components/reserve-card/reserve-card.component';
import { BulletinComponent } from '../../components/bulletin/bulletin.component';
import { ScrollIntoViewDirective } from '../../directives/scroll-into-view.directive';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ReserveCardComponent, BulletinComponent, ScrollIntoViewDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  fullText = 'atlas ride';
  displayedText = '';
  currentIndex = 0;

  @HostListener('window:load')
  startTypingAnimation() {
    const typingSpeed = 80;

    const typingInterval = setInterval(() => {
      if (this.currentIndex < this.fullText.length) {
        this.displayedText += this.fullText.charAt(this.currentIndex);
        this.currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
  }
}
