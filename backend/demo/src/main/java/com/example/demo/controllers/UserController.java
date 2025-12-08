package com.example.demo.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.example.demo.UserDTO.UserDTO;
import com.example.demo.models.UserModel;
import com.example.demo.services.UserService;

import java.util.List;
import java.util.stream.Collectors;

// import com.example.demo.models.UserModel;
// import com.example.demo.repositories.UserRepository;
//import org.apache.catalina.connector.Response;

// import java.util.List;
// import java.util.Optional;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping(value = "/users")
// Adição do localhost do front-end
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService service;

    // http:localhost/8080/users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserModel> usuarios = service.getAll();

        List<UserDTO> dtos = usuarios.stream().map(usuario -> new UserDTO(usuario)).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(dtos);
    }

    // Apenas um usuário
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable int id) {
        UserModel user = service.find(id);

        UserDTO dto = new UserDTO(user);

        if (user != null) {
            return ResponseEntity.status(HttpStatus.OK).body(dto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@RequestBody UserModel model, @PathVariable int id) {
        model.setId(id);
        model = service.update(model);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping()
    public ResponseEntity<UserModel> createUser(@RequestBody UserDTO dto) {
        UserModel savedUser = service.insert(dto);

        // Converter o modelo para o dto

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO login) {

        UserModel user = service.login(login.getEmail(), login.getSenha());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Email ou senha incorretos");
        }

        // Se quiser converter para DTO:
        UserDTO dto = new UserDTO(user);

        return ResponseEntity.ok(dto);
    }

    // // @GetMapping
    // // public String getAllUsers(){
    // // return "Lista de Usuários...";
    // // }

    // // @GetMapping
    // // public List<UserModel> gelAllUsers(){
    // // List<UserModel> lista = new ArrayList<>();
    // // //Simulando o Banco
    // // UserModel usuario1 = new UserModel(1, "João");
    // // UserModel usuario2 = new UserModel(2, "Maria");

    // // lista.add(usuario1);
    // // lista.add(usuario2);

    // // return lista;
    // // }

    // @GetMapping
    // public ResponseEntity<List<UserModel>> getAllUsers(){
    // List<UserModel> lista = repositorio.findAll();

    // return ResponseEntity.status(200).body(lista);
    // }

    // @GetMapping("/{id}")
    // public ResponseEntity<UserModel> getUser(@PathVariable int id){
    // Optional<UserModel> user = repositorio.findById(id);

    // if(user.isPresent()){
    // return ResponseEntity.status(200).body(user.get());
    // }
    // return ResponseEntity.status(404).body(null);
    // }

    // //Recebendo os dados e salvando no banco direto
    // /*
    // {
    // user : "Nome",
    // senha : "123456" <- Sem criptografia
    // senha : "******" <- Com criptografia
    // }
    // */

    // //Professor Colocou no Notion
    // @PostMapping
    // public ResponseEntity<UserModel> createUser(@RequestBody UserModel user) {
    // UserModel usuarioSalvo = repositorio.save(user);

    // return ResponseEntity.status(201).body(usuarioSalvo);
    // }

    // @PutMapping("/{id}")
    // public ResponseEntity<UserModel> updateUser(@PathVariable int id,
    // @RequestBody UserModel dados) {
    // Optional<UserModel> usuario = repositorio.findById(id);

    // if (usuario.isPresent()) {
    // UserModel usuarioExistente = usuario.get();
    // usuarioExistente.setNome(dados.getNome());

    // repositorio.save(usuarioExistente);

    // return ResponseEntity.ok(usuarioExistente);
    // } else {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    // }
    // }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteUser(@PathVariable int id) {
    // Optional<UserModel> usuario = repositorio.findById(id);

    // if (usuario.isPresent()) {
    // repositorio.deleteById(id);
    // return ResponseEntity.noContent().build();
    // } else {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    // }
    // }
}
