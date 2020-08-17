package org.mykola.zakharov.springboot.react.market.internet.market.service.interfaces;

import org.mykola.zakharov.springboot.react.market.internet.market.model.ProductFilterModel;
import org.mykola.zakharov.springboot.react.market.internet.market.model.ProductModel;
import org.mykola.zakharov.springboot.react.market.internet.market.model.ResponseModel;

public interface IProductService {
    ResponseModel create(ProductModel productModel);
    ResponseModel getAll();
    ResponseModel delete(Long id);
    ResponseModel getFiltered(ProductFilterModel filter);
    ResponseModel getProductsPriceBounds();
}
