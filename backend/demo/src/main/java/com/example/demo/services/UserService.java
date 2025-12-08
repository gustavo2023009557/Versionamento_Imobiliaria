package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.UserDTO.UserDTO;
import com.example.demo.models.UserModel;
import com.example.demo.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository repositorio;

    // Http -> Controller -> Service (getAll abaixo V) -> Repository -> Banco
    public List<UserModel> getAll() {
        List<UserModel> lista = repositorio.findAll();
        return lista;
    }

    public UserModel find(int id) {
        Optional<UserModel> model = repositorio.findById(id);

        return model.orElse(null);
    }

    public UserModel insert(UserModel user) {
        return repositorio.save(user);
    }

    public UserModel insert(UserDTO dto) {
        UserModel modelo = new UserModel();
        modelo.setEmail(dto.getEmail());
        modelo.setNome(dto.getNome());
        modelo.setTipo(dto.getTipo());

        // Senha ? modelo.setSenha(dto.getSenha()); <- Futuro

        return repositorio.save(modelo);
    }

    public UserModel update(UserModel user) {
        try {
            if (find(user.getId()) != null) {
                return repositorio.save(user);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public void delete(int id) {
        repositorio.deleteById(id);
    }

    public UserModel login(String email, String senha) {
        Optional<UserModel> model = repositorio.findByEmailAndSenha(email, senha);
        return model.orElse(null);
    }

}
