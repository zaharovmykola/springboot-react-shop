package org.mykola.zakharov.springboot.react.market.internet.market.service.interfaces;

import org.mykola.zakharov.springboot.react.market.internet.market.model.CategoryModel;
import org.mykola.zakharov.springboot.react.market.internet.market.model.ResponseModel;

public interface ICategoryService {
    ResponseModel create(CategoryModel categoryModel);
    ResponseModel getAll();
    ResponseModel delete(Long id);
}
