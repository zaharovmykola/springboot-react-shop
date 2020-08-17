package org.mykola.zakharov.springboot.react.market.internet.market.dao;

import org.mykola.zakharov.springboot.react.market.internet.market.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserHibernateDAO extends JpaRepository<User, Long> {
    User findUserByName(String name);
}
