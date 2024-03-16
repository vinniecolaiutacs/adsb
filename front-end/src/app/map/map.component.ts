import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { AdsbDataService } from '../adsb-data.service';
import { Subscription, interval } from 'rxjs';
import 'leaflet-rotatedmarker';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup = L.layerGroup([]);
  private dataSubscription: Subscription | undefined;
  private planeIcon = L.icon({
    iconUrl: '/adsb/assets/planeIcon2.png',

    iconSize:     [33, 33], // size of the icon
    shadowSize:   [34, 47], // size of the shadow
    iconAnchor:   [16.5, 16.5], // point of the icon which will correspond to marker's location
    shadowAnchor: [15, 80],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

  constructor(private dataService: AdsbDataService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.startDataFetching();
    
  }

  ngOnDestroy(): void {
    this.stopDataFetching();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [25.8282, 30.5795],
      zoom: 3.2
    });
    this.map.setMaxBounds([[-35,-130],[61,160]]);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.markersLayer.addTo(this.map);
  }

  private startDataFetching(): void {
    this.loadData();
    this.dataSubscription = interval(1200).subscribe(() => {
      this.loadData();
    });
  }

  private stopDataFetching(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private loadData(): void {
    this.dataService.getData().subscribe(markersJSON => {
      const markers: any[] = JSON.parse(JSON.stringify(markersJSON.ac));
      const newArray: any[] = [];
      for (let i = 0; i < markers.length - 1; i++) {
        if(markers[i].lat !==undefined){
          newArray.push(markers[i]);
        }
          
      }
      this.updateMarkers(newArray);
    });
  }

  private updateMarkers(markers: any[]): void {
    this.markersLayer.clearLayers();
    markers.forEach(marker => {
        let m = L.marker(L.latLng(marker.lat,marker.lon),{icon: this.planeIcon});
        m.setRotationAngle(marker.track);
        m.addTo(this.markersLayer).bindPopup(marker.hex);
    });
  }
}