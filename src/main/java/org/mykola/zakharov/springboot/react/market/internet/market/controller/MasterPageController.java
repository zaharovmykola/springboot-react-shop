package org.mykola.zakharov.springboot.react.market.internet.market.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MasterPageController {

    @RequestMapping(value = {
            "/",
            "/shopping",
            "/signin",
            "/signup",
            "/admin"
    })
    public String index() {
        return "index.html";
    }
}
