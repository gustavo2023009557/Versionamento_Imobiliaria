package com.example.demo.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders; // Necessário para servir arquivos
import org.springframework.core.io.Resource; // Necessário para servir arquivos
import org.springframework.core.io.UrlResource; // Necessário para servir arquivos

import com.example.demo.UserDTO.FotoImovelDTO;
import com.example.demo.models.FotoImovelModel;
import com.example.demo.services.FotoImovelService; 
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/fotos")
@CrossOrigin(origins = "http://localhost:5173")
public class FotoImovelController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FotoImovelService service;

    // ATENÇÃO: Use o mesmo caminho de destino para salvar e para buscar
    private static final String IMAGE_DIRECTORY = "C:\\Users\\gugra\\Desktop\\Aula 22 09 2025\\demo\\src\\fotos";


    // 1. GET: Listar todas as fotos de um imóvel
    // GET /fotos/imovel/{id}
    @GetMapping("/imovel/{id}")
    public List<FotoImovelModel> listarPorImovel(@PathVariable Integer id) {
        return service.listarPorImovel(id);
    }

    // 2. GET: Buscar a foto capa de um imóvel
    // GET /fotos/capa/{id}
    @GetMapping("/capa/{id}")
    public FotoImovelModel buscarCapa(@PathVariable Integer id) {
        return service.buscarCapaPorImovel(id);
    }

    // 3. POST: Salvar nova foto e arquivo físico
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String salvar(
            @RequestPart("arquivo") MultipartFile arquivo,
            @RequestPart("dados") String dados) throws Exception {
        
        FotoImovelDTO dto = objectMapper.readValue(dados, FotoImovelDTO.class);
        
        // --- CORREÇÃO: Garante que o diretório de destino exista ---
        Path diretorioDestino = Paths.get(IMAGE_DIRECTORY);
        try {
            Files.createDirectories(diretorioDestino);
        } catch (IOException e) {
            throw new RuntimeException("Falha ao criar diretório de destino: " + e.getMessage());
        }
        
        String nomeArquivo = System.currentTimeMillis() + "_" + arquivo.getOriginalFilename();
        Path caminhoArquivo = Paths.get(IMAGE_DIRECTORY, nomeArquivo);

        try {
            // Salva o arquivo físico
            Files.copy(arquivo.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("Arquivo salvo em: " + caminhoArquivo.toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }

        FotoImovelModel model = new FotoImovelModel(dto);
        model.setNomeArquivo(nomeArquivo);
        model.setCaminho(caminhoArquivo.toAbsolutePath().toString());

        // Salva o registro no banco de dados
        service.insert(model); 

        return "Foto cadastrada com sucesso! Nome do arquivo: " + nomeArquivo;
    }

    // 4. DELETE: Deletar foto por ID
    // DELETE /fotos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoto(@PathVariable Integer id) {
        // Assume-se que o Service cuida da exclusão do DB e do arquivo físico
        service.delete(id); 
        return ResponseEntity.noContent().build(); 
    }

    // 5. PATCH: Definir foto como capa
    // PATCH /fotos/{fotoId}/capa/{imovelId}
    @PatchMapping("/{fotoId}/capa/{imovelId}")
    public ResponseEntity<FotoImovelModel> setCapa(@PathVariable Integer fotoId, @PathVariable Integer imovelId) {
        FotoImovelModel updatedFoto = service.setAsCapa(fotoId, imovelId);
        if (updatedFoto != null) {
            return ResponseEntity.ok(updatedFoto);
        }
        return ResponseEntity.notFound().build();
    }
    
    // 6. GET: Servir o arquivo de imagem
    // GET /fotos/imagem/{nomeArquivo}
    // Este endpoint resolve o problema das imagens não aparecerem no frontend.
    @GetMapping("/imagem/{nomeArquivo}")
    public ResponseEntity<Resource> getImagem(@PathVariable String nomeArquivo) {
        
        Path arquivo = Paths.get(IMAGE_DIRECTORY).resolve(nomeArquivo);
        
        try {
            Resource resource = new UrlResource(arquivo.toUri());

            if (resource.exists() || resource.isReadable()) {
                
                // Determina o tipo de conteúdo (MIME Type)
                String contentType = Files.probeContentType(arquivo);
                if (contentType == null) {
                    contentType = "application/octet-stream"; 
                }
                
                // Retorna o arquivo com o cabeçalho HTTP correto
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar imagem: " + nomeArquivo + " - " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}