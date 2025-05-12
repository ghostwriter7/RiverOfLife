import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'
import { PageHeaderComponent } from '../../../components/page-header/page-header.component'
import { Stream } from '../../../model/stream.model'
import { StreamService } from '../../../services/stream/stream.service'

@Component({
  selector: 'app-streams',
  imports: [
    PageHeaderComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.css'
})
export class StreamsComponent implements OnInit {
  protected readonly streams = signal<Stream[]>([]);

  constructor(private readonly streamService: StreamService) {
  }

  public async ngOnInit(): Promise<void> {
    this.streams.set(await this.streamService.getAll());
  }
}
