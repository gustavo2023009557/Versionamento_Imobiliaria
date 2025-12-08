package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Adicionar este import
import org.springframework.data.repository.query.Param; // Adicionar este import

import com.example.demo.models.ImovelModel;

public interface ImovelRepository extends JpaRepository<ImovelModel, Integer>{
   
    //Usar @Query para resolver a ambiguidade na criação da consulta
    // A JPQL usa o nome da propriedade Java (usuarioId) do ImovelModel.
    @Query("SELECT i FROM ImovelModel i WHERE i.usuario_id = :userId")
    List<ImovelModel> findByUsuarioId(@Param("userId") Integer userId);
}