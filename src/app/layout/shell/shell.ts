import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Header } from '@layout/header/header';
import { Sidebar } from '@layout/sidebar/sidebar';
import { Footer } from '@layout/footer/footer';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NzLayoutModule, Header, Sidebar, Footer],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  readonly sidebarOpen = signal(true);

  onMenuToggle(): void {
    this.sidebarOpen.update((v) => !v);
  }
}
