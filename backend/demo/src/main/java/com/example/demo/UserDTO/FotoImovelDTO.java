package com.example.demo.UserDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FotoImovelDTO {
    
    private Integer id;
    private Integer imovelId;
    private String nomeArquivo;
    private String caminho;
    private Boolean capa;
    private Integer ordem;

}
