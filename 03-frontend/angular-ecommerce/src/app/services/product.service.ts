import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

//Our service can be injected into other classes or components.
//providedIn: 'root' means this class can be injected globlely.
@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category'; 
  //Inject httpClient
  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    //need to build URL based on category id, page and size.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  //Returns an observable of Product[].
  //Map the JSON data from Spring Data REST to Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    //need to build URL based on category id.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
        //need to build URL based on keyword.
        const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

        return this.getProducts(searchUrl); 
        
  }

  searchProductsPaginate(thePage: number, 
                         thePageSize: number, 
                         theKeyword: string): Observable<GetResponseProducts> {

    //need to build URL based on keyword, page and size.
    //Spring Data REST supports pagination out of the box.
    //Just send the parameters for page and size.
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    //Returns an observable.
    //It maps the JSON data from Spring Data REST to ProductCategory array.
                                                          //Call the REST API
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

//Unwraps the JSON from Spring Data REST _embedded entry.
//It will take _embedded, and then take the products inside the _embedded, and then map those to given products.
  interface GetResponseProducts{
    _embedded: {
      products: Product[];
    },
    page: {
      size: number,
      totalElements: number,
      totalPages: number,
      number: number
    }
  }

  interface GetResponseProductCategory{
    _embedded: {
      productCategory: ProductCategory[];
    }
  }

