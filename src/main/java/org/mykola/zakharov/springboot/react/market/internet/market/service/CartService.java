package org.mykola.zakharov.springboot.react.market.internet.market.service;

import org.mykola.zakharov.springboot.react.market.internet.market.dao.CartMongoDAO;
import org.mykola.zakharov.springboot.react.market.internet.market.dao.ProductHibernateDAO;
import org.mykola.zakharov.springboot.react.market.internet.market.dao.UserHibernateDAO;
import org.mykola.zakharov.springboot.react.market.internet.market.entity.Product;
import org.mykola.zakharov.springboot.react.market.internet.market.model.Cart;
import org.mykola.zakharov.springboot.react.market.internet.market.model.CartItem;
import org.mykola.zakharov.springboot.react.market.internet.market.model.ResponseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private ProductHibernateDAO productDAO;

    @Autowired
    private UserHibernateDAO userDAO;

    @Autowired
    private CartMongoDAO cartDAO;

    public Cart getCart(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            Long userId =
                    userDAO.findUserByName(authentication.getName()).getId();
            Cart cart = cartDAO.findCartByUserId(userId);
            if (cart == null) {
                cart = new Cart();
                cart.setUserId(userId);
            }
            return cart;
        } else {
            return null;
        }
    }

    public ResponseModel getCartItems (Authentication authentication) {
        Cart cart = getCart(authentication);
        if (cart != null) {
            return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message("Cart data fetched successfully")
                    .data(cart.getCartItems())
                    .build();
        } else {
            return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message("No cart")
                    .build();
        }
    }

    // изменить число определенного товара в объекте корзины
    public ResponseModel changeCartItemCount(Authentication authentication, Long productId, CartItem.Action action) {
        Cart cart = getCart(authentication);
        CartItem currentCartItem = null;
        // в БД находим описание товара по его ИД
        Product product = productDAO.findById(productId).get();
        // в объекте корзины пытаемся найти элемент списка товаров в корзине,
        // у которого ИД описания товара такой же, как заданный для изменения
        Optional<CartItem> currentCartItemOptional =
                cart.getCartItems()
                        .stream()
                        .filter((item) -> item.getProductId().equals(productId))
                        .findFirst();
        // если в корзине уже был хотя бы один такой товар
        if (currentCartItemOptional.isPresent()) {
            currentCartItem = currentCartItemOptional.get();
        } else {
            // если нет - добавляем товар в корзину с указанием его количества равным 0
            currentCartItem =
                    CartItem.builder()
                            .productId(productId)
                            .name(product.getName())
                            .price(product.getPrice())
                            .quantity(0)
                            .build();
            cart.getCartItems().add(currentCartItem);
        }
        if (action != null) {
            switch (action) {
                case ADD:
                    // увеличение числа товара в корзтине на 1
                    currentCartItem.setQuantity(currentCartItem.getQuantity() + 1);
                    break;
                case SUB:
                    // уменьшение числа товара в корзтине на 1,
                    // но если осталось 0 или меньше - полное удаление товара из корзины
                    currentCartItem.setQuantity(currentCartItem.getQuantity() - 1);
                    if (currentCartItem.getQuantity() <= 0) {
                        cart.getCartItems().remove(currentCartItem);
                    }
                    break;
                case REM:
                    // безусловное полное удаление товара из корзины
                    cart.getCartItems().remove(currentCartItem);
                    break;
                default:
                    break;
            }
        }
        // сохранение объекта корзины в MongoDB -
        // первичное или обновление
        cartDAO.save(cart);
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message("Cart data changed successfully")
                .data(cart.getCartItems())
                .build();
    }

    public void clearCartItems (Authentication authentication) {
        Cart cart = getCart(authentication);
        if (cart != null) {
            cart.getCartItems().clear();
            cartDAO.save(cart);
        }
    }

}