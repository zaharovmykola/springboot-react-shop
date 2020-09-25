package org.mykola.zakharov.springboot.react.market.internet.market.controller;

import org.mykola.zakharov.springboot.react.market.internet.market.model.Cart;
import org.mykola.zakharov.springboot.react.market.internet.market.model.CartItem;
import org.mykola.zakharov.springboot.react.market.internet.market.model.ResponseModel;
import org.mykola.zakharov.springboot.react.market.internet.market.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // внедрение объекта сеанса http через аргумент метода
    @GetMapping("")
    public ResponseEntity<ResponseModel> getCartItems(HttpSession httpSession) {
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        return new ResponseEntity<>(cartService.getCartItems(cart), HttpStatus.OK);
    }

    @PostMapping("/{id}")
    public ResponseEntity<ResponseModel> addCartItemCount(@PathVariable("id") Long id, HttpSession httpSession) {
        // попытка извлечь из объекта сеанса объект корзины
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            // если не удалось - создаем новый объект корзины
            cart = new Cart();
        }
        // вызов метода службы - увеличить число товара в корзине на 1
        ResponseModel response =
                cartService.changeCartItemCount(
                        cart
                        , id
                        , CartItem.Action.ADD
                );
        // сохранение объекта корзины в сеанс -
        // первичное или обновление
        httpSession.setAttribute("CART", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseModel> subtractCartItemCount(@PathVariable("id") Long id, HttpSession httpSession) throws InstantiationException, IllegalAccessException {
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        ResponseModel response =
                cartService.changeCartItemCount(
                        cart
                        , id
                        , CartItem.Action.SUB
                );
        httpSession.setAttribute("CART", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<ResponseModel> deleteCartItem(@PathVariable("id") Long id, HttpSession httpSession) {
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        ResponseModel response =
                cartService.changeCartItemCount(
                        cart
                        , id
                        , CartItem.Action.REM
                );
        httpSession.setAttribute("CART", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}