import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CryptoService } from '../../core/services/crypto.service';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit, OnDestroy{
  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    
    this.fragmentSubscription = this.route.fragment.subscribe(fragment => {

      if (!fragment) {
        return;
      }

      const data = this.cryptoService.decrypt(fragment) as { gameType: string, selectedType: string, inputMethod: string, selectedSize: string };
      
      console.log(data);

      this.gameType = data.gameType;
      this.selectedType = data.selectedType || 'classic';
      this.inputMethod = data.inputMethod || 'manual';
      this.selectedSize = data.selectedSize || '9×9';
      this.gridChange();
    });
    
  }


  fragmentSubscription: any;
  selectedType = 'classic';
  
  inputMethod = 'manual';
  
  selectedSize = '9×9';
  
  gridSizes = ['4×4', '9×9', '16×16', '25×25', '36×36'];
  
  gameType = 'solve';
  
  
  selectType(type: string) {
    this.selectedType = type;
    this.gridChange();
    if(type === 'classic'){
      this.selectedSize = '9×9';
    }
    else{
      this.selectedSize = '6×6';
    }
    
  }

  gridChange() {
    if(this.selectedType === 'classic'){
      this.gridSizes = ['4×4','9×9','16×16','25×25','36×36'];
    }
    else{
      this.gridSizes = ['6×6','8×8','12×12','15×15','20×20'];
    }
  }

  continue(){

    const fragmentData = {
      gameType: this.gameType,
      selectedType: this.selectedType,
      inputMethod: this.inputMethod,
      selectedSize: this.selectedSize
    };
    
    this.router.navigate(['/solve'], { fragment: this.cryptoService.encrypt(fragmentData) });
    
  }
  
  ngOnDestroy(): void {
    this.fragmentSubscription.unsubscribe();
  }
}