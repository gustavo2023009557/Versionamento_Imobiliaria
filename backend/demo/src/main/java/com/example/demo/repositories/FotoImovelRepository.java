package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // Importar
import org.springframework.data.jpa.repository.Query; // Importar
import org.springframework.data.repository.query.Param; // Importar
import org.springframework.transaction.annotation.Transactional; // Importar

import com.example.demo.models.FotoImovelModel;

public interface FotoImovelRepository extends JpaRepository<FotoImovelModel, Integer> {

    // Pesquisa todas as fotos pelo ID do Imóvel (já deve existir)
    List<FotoImovelModel> findByImovelId(Integer imovelId);

    // Pesquisa a foto capa (já deve existir)
    FotoImovelModel findByImovelIdAndCapaTrue(Integer imovelId);

    @Modifying
    @Transactional
    @Query("UPDATE FotoImovelModel f SET f.capa = FALSE WHERE f.imovelId = :imovelId")
    void resetCapaByImovelId(@Param("imovelId") Integer imovelId);
}