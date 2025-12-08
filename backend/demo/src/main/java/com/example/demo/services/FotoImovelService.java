package com.example.demo.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Adicionar

import com.example.demo.models.FotoImovelModel;
import com.example.demo.repositories.FotoImovelRepository;

@Service
public class FotoImovelService {
    
    @Autowired
    private FotoImovelRepository repository;

    public List<FotoImovelModel> getAll(){
        return repository.findAll();
    }
    
    public FotoImovelModel insert (FotoImovelModel objeto){
        return repository.save(objeto);
    }
    
    // Método para buscar por ID (útil para exclusão)
    public FotoImovelModel findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // Método de exclusão ajustado para incluir exclusão do arquivo físico (OPCIONAL/SUGESTÃO)
    public void delete(Integer id){
        FotoImovelModel foto = findById(id);
        if (foto != null) {
            // Tenta deletar o arquivo físico primeiro
            Path caminhoArquivo = Paths.get(foto.getCaminho());
            try {
                // Remove o arquivo físico
                Files.deleteIfExists(caminhoArquivo);
                System.out.println("Arquivo físico deletado: " + caminhoArquivo.toAbsolutePath());
            } catch (IOException e) {
                // Loga, mas continua para deletar o registro do DB
                System.err.println("Erro ao deletar arquivo físico: " + e.getMessage());
            }
            // Deleta o registro do banco de dados
            repository.deleteById(id);
        }
    }
    
    public List<FotoImovelModel> listarPorImovel(Integer imovelId){
        return repository.findByImovelId(imovelId);
    }

    public FotoImovelModel buscarCapaPorImovel(Integer imovelId){
        return repository.findByImovelIdAndCapaTrue(imovelId);
    }

    // NOVO MÉTODO: Lógica para definir uma foto como capa
    @Transactional
    public FotoImovelModel setAsCapa(Integer fotoId, Integer imovelId) {
        // 1. Resetar o campo 'capa' para FALSE em todas as fotos do imóvel
        repository.resetCapaByImovelId(imovelId);

        // 2. Buscar a foto específica e defini-la como capa
        FotoImovelModel foto = findById(fotoId);
        if (foto != null && foto.getImovelId().equals(imovelId)) {
            foto.setCapa(true);
            // O save atualizará o registro existente
            return repository.save(foto); 
        }
        return null;
    }
}