package org.mykola.zakharov.springboot.react.market.internet.market.dao;

import org.mykola.zakharov.springboot.react.market.internet.market.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleHibernateDAO extends JpaRepository<Role, Long> {
    Role findRoleByName(String name);
}
