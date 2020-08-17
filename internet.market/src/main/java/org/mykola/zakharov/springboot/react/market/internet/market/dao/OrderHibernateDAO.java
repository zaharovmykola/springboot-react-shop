package org.mykola.zakharov.springboot.react.market.internet.market.dao;

import org.mykola.zakharov.springboot.react.market.internet.market.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderHibernateDAO extends JpaRepository<Order, Long> {

}