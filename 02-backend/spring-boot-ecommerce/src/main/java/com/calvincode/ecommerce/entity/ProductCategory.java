package com.calvincode.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name="product_category")
// @Data -- known bug for one to many or many to one
@Getter // by lombok
@Setter
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name")
    private String categoryName;

    //mappedBy tells Hibernate look at the category property in the Product class,
    //use information from the Product class @JoinColumn,
    //to help find associated products for category.
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "category")
    private Set<Product> products;




}
