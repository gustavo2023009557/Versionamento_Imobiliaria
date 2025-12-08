package com.example.demo.models;

import java.io.Serializable;

import com.example.demo.UserDTO.FotoImovelDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="fotos_imoveis")
@Getter
@Setter
// NOVO: Ignora campos internos do Hibernate para evitar LazyInitializationException
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class FotoImovelModel implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    private Integer imovelId;

    private String nomeArquivo;
    
    private String caminho;
    
    private Boolean capa;

    private Integer ordem;

    // NOVO: Construtor Padrão (Sem Argumentos) - Essencial para JPA/Hibernate
    public FotoImovelModel() {
    }

    public FotoImovelModel(FotoImovelDTO dto){
        this.id = dto.getId();
        this.imovelId = dto.getImovelId();
        this.nomeArquivo = dto.getNomeArquivo();
        this.caminho = dto.getCaminho();
        this.capa = dto.getCapa();
        this.ordem = dto.getOrdem();
    }
}