package org.mykola.zakharov.spring.boot.first.ecommerceshop.application.dao;

import org.junit.jupiter.api.Test;
import org.mykola.zakharov.springboot.react.market.EcommerceShopApplication;
import org.mykola.zakharov.springboot.react.market.internet.market.dao.ProductHibernateDAO;
import org.mykola.zakharov.springboot.react.market.internet.market.dao.predicate.ProductPredicatesBuilder;
import org.mykola.zakharov.springboot.react.market.internet.market.entity.Product;
import org.mykola.zakharov.springboot.react.market.internet.market.model.ResponseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.NONE,
        classes = EcommerceShopApplication.class
)
public class ProductDaoTest {

    @Autowired
    private ProductHibernateDAO productDAO;

    @Test
    public void getProductsPriceMinTest() {
        BigDecimal minPrice =
                productDAO.findMinimum();
        assertNotNull(minPrice);
        BigDecimal expectedPrice = new BigDecimal(55.82);
        expectedPrice = expectedPrice.setScale(2, RoundingMode.FLOOR);
        minPrice = minPrice.setScale(2, RoundingMode.FLOOR);
        assertEquals(expectedPrice, minPrice);
    }

    @Test
    public void getProductsPriceMaxTest() {
        BigDecimal maxPrice =
                productDAO.findTop1ByOrderByPriceDesc().getPrice();
        assertNotNull(maxPrice);
        BigDecimal expectedPrice = new BigDecimal(232.48d);
        expectedPrice = expectedPrice.setScale(2, RoundingMode.CEILING);
        maxPrice = maxPrice.setScale(2, RoundingMode.CEILING);
        assertEquals(expectedPrice, maxPrice);
    }
}
