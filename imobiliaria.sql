-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/12/2025 às 01:55
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `imobiliaria`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `bairros`
--

CREATE TABLE `bairros` (
  `id` int(11) NOT NULL,
  `cep` varchar(255) DEFAULT NULL,
  `cidade` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `cep_final` varchar(255) DEFAULT NULL,
  `cep_inicial` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `bairros`
--

INSERT INTO `bairros` (`id`, `cep`, `cidade`, `estado`, `nome`, `cep_final`, `cep_inicial`) VALUES
(1, 'teste', 'Teste ', 'RS', 'Testando', '98290002', '98290001'),
(3, NULL, 'Condor', 'Rio Grande do Sul', 'Centro', '98090000', '98290000');

-- --------------------------------------------------------

--
-- Estrutura para tabela `fotos_imoveis`
--

CREATE TABLE `fotos_imoveis` (
  `id` int(11) NOT NULL,
  `caminho` varchar(255) DEFAULT NULL,
  `capa` bit(1) DEFAULT NULL,
  `nome_arquivo` varchar(255) DEFAULT NULL,
  `ordem` int(11) DEFAULT NULL,
  `imovel_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fotos_imoveis`
--

INSERT INTO `fotos_imoveis` (`id`, `caminho`, `capa`, `nome_arquivo`, `ordem`, `imovel_id`) VALUES
(30, 'C:\\Users\\gugra\\Desktop\\Aula 22 09 2025\\demo\\src\\fotos\\1765240023909_5003520287642946367.jpg', b'1', '1765240023909_5003520287642946367.jpg', 1, 25),
(32, 'C:\\Users\\gugra\\Desktop\\Aula 22 09 2025\\demo\\src\\fotos\\1765241586365_5003520287642946367.jpg', b'0', '1765241586365_5003520287642946367.jpg', 1, 26),
(33, 'C:\\Users\\gugra\\Desktop\\Aula 22 09 2025\\demo\\src\\fotos\\1765241591026_foto.jpg', b'1', '1765241591026_foto.jpg', 2, 26);

-- --------------------------------------------------------

--
-- Estrutura para tabela `imoveis`
--

CREATE TABLE `imoveis` (
  `id` int(11) NOT NULL,
  `area_construida` decimal(15,2) DEFAULT NULL,
  `area_total` decimal(15,2) DEFAULT NULL,
  `banheiros` int(11) DEFAULT NULL,
  `caracteristicas` text DEFAULT NULL,
  `complemento` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `destaque` bit(1) DEFAULT NULL,
  `dormitorios` int(11) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `finalidade` varchar(255) DEFAULT NULL,
  `garagem` int(11) DEFAULT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `preco_aluguel` decimal(15,2) DEFAULT NULL,
  `preco_venda` decimal(15,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `bairro_id` int(11) DEFAULT NULL,
  `tipo_imovel_id` int(11) DEFAULT NULL,
  `cep` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `imoveis`
--

INSERT INTO `imoveis` (`id`, `area_construida`, `area_total`, `banheiros`, `caracteristicas`, `complemento`, `descricao`, `destaque`, `dormitorios`, `endereco`, `finalidade`, `garagem`, `numero`, `preco_aluguel`, `preco_venda`, `status`, `titulo`, `bairro_id`, `tipo_imovel_id`, `cep`, `usuario_id`) VALUES
(26, 2.00, 2.00, 2, '2', 'A', 'A', b'0', 2, 'Tiradentes', '2', 2, '80', 2.00, 2.00, '2', 'A', 1, 4, '98290000', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tipos_imoveis`
--

CREATE TABLE `tipos_imoveis` (
  `id` int(11) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tipos_imoveis`
--

INSERT INTO `tipos_imoveis` (`id`, `descricao`, `nome`) VALUES
(4, 'Complemento Casa', 'Casa');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `tipo`) VALUES
(1, 'Gustavo', 'gu@teste', '123', 'admin'),
(2, 'Teste', 'teste@teste', '123', 'admin'),
(3, 'Teste2', 'teste2@teste', '123', 'comum');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `bairros`
--
ALTER TABLE `bairros`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `fotos_imoveis`
--
ALTER TABLE `fotos_imoveis`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `imoveis`
--
ALTER TABLE `imoveis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlbe75ud15gr1jhci27a5febtj` (`bairro_id`),
  ADD KEY `FK8l4n1619tyasatoa0a7051ins` (`tipo_imovel_id`);

--
-- Índices de tabela `tipos_imoveis`
--
ALTER TABLE `tipos_imoveis`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `bairros`
--
ALTER TABLE `bairros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `fotos_imoveis`
--
ALTER TABLE `fotos_imoveis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de tabela `imoveis`
--
ALTER TABLE `imoveis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de tabela `tipos_imoveis`
--
ALTER TABLE `tipos_imoveis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `imoveis`
--
ALTER TABLE `imoveis`
  ADD CONSTRAINT `FK8l4n1619tyasatoa0a7051ins` FOREIGN KEY (`tipo_imovel_id`) REFERENCES `tipos_imoveis` (`id`),
  ADD CONSTRAINT `FKlbe75ud15gr1jhci27a5febtj` FOREIGN KEY (`bairro_id`) REFERENCES `bairros` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
