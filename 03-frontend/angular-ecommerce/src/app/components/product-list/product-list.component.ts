import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  
  previousKeyword: string = null

  //Inject ProductService, ActivatedRoute
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  //Similar to @PostConstruct
  //The PostConstruct annotation is used on a method that needs to be executed after dependency injection is done to perform any initialization.
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    }); 
  }

  //Method is invoked once you "subscribe"
  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //now search for the products using keyword.
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
    
  }

  handleListProducts(){

    // check if "id" parameter is available.
    //.route - Use the activated route.
    //.snapshot - State of route at this given moment in time.
    //.paramMap - Map of all the route parameters.
    //.has('id') - Read the id parameter.
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    //Check if we have a different category than previous
    //Note: Augular will reuse a component if it is currently being viewed
    // if we have a different category id than previous
    if (this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    // now get the products for the given category id;
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId).subscribe(this.processResult());

  }
  processResult(){
    return data => {
      //Everything on right-hand side of assignment is data from Spring Data REST JSON.
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1; //Spring Data REST: pages are 0 based.
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

}
