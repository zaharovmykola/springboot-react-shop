package org.mykola.zakharov.springboot.react.market.internet.market.dao;

import antlr.collections.List;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import org.mykola.zakharov.springboot.react.market.internet.market.entity.Category;
import org.mykola.zakharov.springboot.react.market.internet.market.entity.Product;
import org.mykola.zakharov.springboot.react.market.internet.market.entity.QProduct;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductHibernateDAO extends JpaRepository<Product, Long>,
        QuerydslPredicateExecutor<Product>, QuerydslBinderCustomizer<QProduct> {

    // пользовательский метод получения списка товаров,
    // идентификаторы категорий которых входят в множество,
    // заданное параметром :ids,
    // который получает список идентификаторов категорий из объекта списка
    // @Param("ids") List<Long> categoryIds,
    // передаваемого при вызове метода в качестве аргумента
    // (явно задается JPQL-запрос, который должен выполнить модуль Spring Data)
    @Query( "SELECT p FROM Product p WHERE p.category.id IN :ids" )
    List<Product> findByCategoryIds(
            @Param("ids") List<Long> categoryIds,
            Sort sort
    );

    // добавление поддержки запросов query dsl
    // (предварительно нужно сгенерировать тип QProduct командой
    // mvn apt:process)
    @Override
    default public void customize(
            QuerydslBindings bindings, QProduct root) {
        bindings.bind(String.class)
                .first((SingleValueBinding<StringPath, String>) StringExpression::containsIgnoreCase);
        bindings.excluding(root.image);
    }

    @Query( "SELECT MIN(p.price) FROM Product p" )
    BigDecimal findMinimum ();

    Product findTop1ByOrderByPriceDesc ();

    Integer countProductsByCategory(Category category);
}
