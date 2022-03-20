//These match with the actual JSON data that's passed back from the spring boot service (via REST API). 
export class Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    unitPrice: string; 
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdated: Date;
}
