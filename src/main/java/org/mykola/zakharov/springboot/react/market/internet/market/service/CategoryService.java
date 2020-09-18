package org.mykola.zakharov.springboot.react.market.internet.market.service;

import antlr.collections.List;
import com.google.common.base.Optional;
import org.mykola.zakharov.springboot.react.market.internet.market.dao.CategoryHibernateDAO;
import org.mykola.zakharov.springboot.react.market.internet.market.dao.ProductHibernateDAO;
import org.mykola.zakharov.springboot.react.market.internet.market.entity.Category;
import org.mykola.zakharov.springboot.react.market.internet.market.model.CategoryModel;
import org.mykola.zakharov.springboot.react.market.internet.market.model.ResponseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryHibernateDAO categoryHibernateDAO;

    @Autowired
    private ProductHibernateDAO productDao;

    public ResponseModel create(CategoryModel categoryModel) {
        Category category =
            Category.builder()
                    .name(categoryModel.getName().trim())
                    .build();
        categoryHibernateDAO.save(category);
        // Demo Logging
        System.out.println(String.format("Category %s Created", category.getName()));
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message(String.format("Category %s Created", category.getName()))
            .build();
    }

    public ResponseModel update(CategoryModel categoryModel) {
        Category category =
                Category.builder()
                        .id(categoryModel.getId())
                        .name(categoryModel.getName().trim())
                        .build();
        categoryHibernateDAO.save(category);
        // Demo Logging
        System.out.println(String.format("Category %s Updated", category.getName()));
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Category %s Updated", category.getName()))
                .build();
    }

    public ResponseModel getAll() {
//        вызываем метод findAll с Sort по колонке id в обратном порядке descending
        List<Category> categories = categoryHibernateDAO.findAll(Sort.by("id").descending());
        List<CategoryModel> categoryModels =
            categories.stream()
            .map(c ->
                CategoryModel.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .build()
            )
            .collect(Collectors.toList());
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .data(categoryModels)
            .build();
    }

    public ResponseModel delete(Long id) {
        Optional<Category> categoryOptional = categoryHibernateDAO.findById(id);
        if (categoryOptional.isPresent()){
            Category category = categoryOptional.get();
            System.out.println(productDao.countProductsByCategory(category) == 0);
            if(productDao.countProductsByCategory(category) == 0) {
                categoryHibernateDAO.delete(category);
                return ResponseModel.builder()
                        .status(ResponseModel.SUCCESS_STATUS)
                        .message(String.format("Category #%s Deleted", category.getName()))
                        .build();
            } else {
                return ResponseModel.builder()
                        .status(ResponseModel.FAIL_STATUS)
                        .message(String.format("Can't delete the category #%s. There are some products in this category.", category.getName()))
                        .build();
            }
        } else {
            return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(String.format("Category #%d Not Found", id))
                    .build();
        }
    }
}
