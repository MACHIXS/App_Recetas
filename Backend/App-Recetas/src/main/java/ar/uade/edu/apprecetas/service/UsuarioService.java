package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.RegistroDTO;
import ar.uade.edu.apprecetas.dto.LoginDTO;
import ar.uade.edu.apprecetas.model.Usuario;
import ar.uade.edu.apprecetas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario registrarUsuario(RegistroDTO dto) throws Exception {
        if (usuarioRepository.existsByNickname(dto.getNickname())) {
            throw new Exception("Alias ya existe");
        }
        if (usuarioRepository.findByMail(dto.getMail()).isPresent()) {
            throw new Exception("Email ya registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setMail(dto.getMail());
        usuario.setNickname(dto.getNickname());
        usuario.setHabilitado("No");
        usuario.setPassword("temp123"); // Valor temporal
        return usuarioRepository.save(usuario);
    }

    public Usuario login(LoginDTO dto) throws Exception {
        Optional<Usuario> opt = usuarioRepository.findByMail(dto.getMail());
        if (opt.isEmpty()) {
            throw new Exception("Email inválido");
        }
        Usuario usuario = opt.get();
        if (!usuario.getPassword().equals(dto.getPassword())) {
            throw new Exception("Contraseña incorrecta");
        }
        return usuario;
    }
}