-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2024 at 04:36 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yciyc-tokens`
--

-- --------------------------------------------------------

--
-- Table structure for table `liked_tokens`
--

CREATE TABLE `liked_tokens` (
  `id` int(11) NOT NULL,
  `token_id` int(11) DEFAULT NULL,
  `user_wallet_address` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `liked_tokens`
--

INSERT INTO `liked_tokens` (`id`, `token_id`, `user_wallet_address`, `timestamp`) VALUES
(1, 1, NULL, '2024-07-09 01:44:55'),
(2, 1, 'ABCD', '2024-07-09 01:48:52'),
(3, 1, 'ABCD111', '2024-07-09 01:52:05');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `symbol` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `token_image` text DEFAULT NULL,
  `initial_supply` decimal(18,8) NOT NULL,
  `twitter_link` text DEFAULT NULL,
  `telegram_link` text DEFAULT NULL,
  `website_link` text DEFAULT NULL,
  `user_wallet_address` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `name`, `symbol`, `description`, `token_image`, `initial_supply`, `twitter_link`, `telegram_link`, `website_link`, `user_wallet_address`, `created_at`) VALUES
(1, 'Token Name', 'TKN', 'Token description', 'http://example.com/token-image.png', 850000.00000000, 'http://twitter.com/token', 'http://t.me/token', 'http://token.com', 'user_wallet_address', '2024-07-09 01:17:47');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `token_id` int(11) DEFAULT NULL,
  `user_wallet_address` varchar(255) DEFAULT NULL,
  `type` enum('buy','sell','supply','purchase') DEFAULT NULL,
  `amount` decimal(18,8) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `token_id`, `user_wallet_address`, `type`, `amount`, `timestamp`) VALUES
(1, 1, 'abcd', 'buy', 100.00000000, '2024-07-09 01:52:51'),
(2, 1, 'user_wallet_address', 'sell', 100.00000000, '2024-07-09 01:53:34'),
(3, 1, 'user_wallet_address', 'supply', 100.00000000, '2024-07-09 01:54:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `wallet_address` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `wallet_address`, `created_at`) VALUES
(1, 'user_wallet_address', '2024-07-09 01:16:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `liked_tokens`
--
ALTER TABLE `liked_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `token_id` (`token_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `token_id` (`token_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_address` (`wallet_address`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `liked_tokens`
--
ALTER TABLE `liked_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `liked_tokens`
--
ALTER TABLE `liked_tokens`
  ADD CONSTRAINT `liked_tokens_ibfk_1` FOREIGN KEY (`token_id`) REFERENCES `tokens` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`token_id`) REFERENCES `tokens` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
