package org.mykola.zakharov.springboot.react.market.internet.market.dao;

import org.mykola.zakharov.springboot.react.market.internet.market.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentHibernateDAO extends JpaRepository<Payment, Long> {
    List<Payment> findByVendor(String vendor);
}
