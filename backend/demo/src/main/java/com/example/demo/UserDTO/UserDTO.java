package com.example.demo.UserDTO;

import com.example.demo.models.UserModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Integer id;

    private String nome;

    private String email;

    private String tipo;
    
    private String senha;
    
    public UserDTO() {
    }

    public UserDTO(Integer id, String nome, String email, String tipo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipo = tipo;
    }

    //Removido por retornar a Senha
    
    public UserDTO(UserModel model) {
        this.id = model.getId();
        this.nome = model.getNome();
        this.email = model.getEmail();
        this.tipo = model.getTipo();
        // this.senha = model.getSenha();
    }

}
