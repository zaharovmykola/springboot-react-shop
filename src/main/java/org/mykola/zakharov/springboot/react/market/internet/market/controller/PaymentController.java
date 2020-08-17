package org.mykola.zakharov.springboot.react.market.internet.market.controller;

import org.mykola.zakharov.springboot.react.market.internet.market.entity.Payment;
import org.mykola.zakharov.springboot.react.market.internet.market.model.PaymentResponseModel;
import org.mykola.zakharov.springboot.react.market.internet.market.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService service;

    @PostMapping("/payNow")
    public PaymentResponseModel payInstant(@RequestBody Payment payment) {
        return service.pay(payment);
    }

    @GetMapping("/getTransactionsByVendor/{vendor}")
    public PaymentResponseModel getTransaction(@PathVariable String vendor) {
        return service.getTx(vendor);
    }
}
