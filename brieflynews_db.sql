-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2025 at 06:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `brieflynews`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `newsId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `newsId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `commentText` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `parentId` int(11) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `dislikes` int(11) DEFAULT 0,
  `replyToUser` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int(11) NOT NULL,
  `commentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` enum('like','dislike') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Draft',
  `authorId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `description`, `imageUrl`, `date`, `category`, `status`, `authorId`) VALUES
(1, 'New Tech Update', 'The latest advancements in AI technology.', 'https://tse1.mm.bing.net/th/id/OIP.HouHLbEs7ycqPzxKj5dKDwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3', '2023-07-23', '', 'Published', NULL),
(2, 'Space Exploration Milestone', 'NASA\'s mission to Mars reaches a new milestone.', 'https://tse2.mm.bing.net/th/id/OIP.HuJKKu3LCmR4Rqv1WT4rHAHaE4?rs=1&pid=ImgDetMain&o=7&rm=3', '2023-07-22', '', 'Published', NULL),
(3, 'Economic Recovery After Pandemic', 'Global economy shows signs of recovery post-pandemic.', 'https://th.bing.com/th/id/OIP.cspeynHglXrMBRzt5TakIQHaE8?w=291&h=195&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2023-07-21', '', 'Published', NULL),
(4, 'Green Energy Revolution', 'New technologies in green energy are transforming the world.', 'https://th.bing.com/th/id/OIP.6xrSHPENAYZgLeybeputuQHaEL?w=309&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2023-07-20', '', 'Published', NULL),
(5, 'Sports Event Highlights', 'This weekend\'s biggest sporting events.', 'https://th.bing.com/th/id/OIP.K5SeukaOC5BpQQC-AW_UlgHaDJ?w=296&h=149&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2023-07-19', '', 'Published', NULL),
(6, 'Breakthrough in Quantum Computing', 'A major breakthrough in quantum computing could revolutionize technology.', 'https://th.bing.com/th/id/OIP.kQIHpRq3HAl8bCYF6ARIaAHaEJ?w=333&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2023-07-18', '', 'Published', NULL),
(7, 'BREAKING NEWS!!! SEORANG MANTAN PRESIDEN MENDUPLIKASI LUKISAN RADEN SALEH', 'Pada akhir bulan lalu seorang mantan presiden meminta kepada seorang mahasiswa institusi kesenian jakarta untuk membuatkan replika yang sangat mirip dengan lukisan raden saleh', 'https://3.bp.blogspot.com/-pU1tfullHms/U-oJ0SFzgWI/AAAAAAAAA8E/wdLqqrNPXqg/s1600/raden%2Bsaleh%2C%2Ban%2BIndonesian%2Bromantic%2Bpainter4.jpg', '2025-07-02', '', 'Published', NULL),
(8, 'Space event', 'blablabla', 'https://tse3.mm.bing.net/th/id/OIP.jRDG76kMqSFq-auRs-vCeQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', '2025-06-01', '', 'Published', NULL),
(9, 'AI Revolutionizes Healthcare', 'AI membantu dokter mendiagnosa penyakit lebih cepat dan akurat.', 'https://th.bing.com/th/id/OIP.Zi7ob_1GYeVq-py3bQXVegHaD4?w=298&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-18', 'teknologi', 'Published', NULL),
(10, 'Startup Indonesia Ciptakan Mobil Terbang', 'Prototipe mobil terbang pertama akan diuji coba di Jakarta.', 'https://th.bing.com/th/id/OIP.2WEYX0bDUQDOuSqXSoM3TwHaFU?w=244&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-15', 'teknologi', 'Published', NULL),
(11, 'Teknologi 6G Mulai Diuji di Korea', 'Korea Selatan menjadi negara pertama yang uji coba jaringan 6G.', 'https://th.bing.com/th/id/OIP.vyVL6vIIK7wAs4nwhksFvAHaD4?w=345&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-10', 'teknologi', 'Published', NULL),
(12, 'Pemilu 2025: Debat Capres Memanas', 'Isu pendidikan dan ekonomi menjadi sorotan utama.', 'https://th.bing.com/th/id/OIP.zdGTUT026GHys8E41TKJQgAAAA?w=321&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-17', 'politik', 'Published', NULL),
(13, 'RUU Perlindungan Data Disahkan', 'RUU ini memberi perlindungan lebih bagi data pribadi warga.', 'https://th.bing.com/th/id/OIP.UnKDviho020LG_H6hs-DNAHaEK?w=277&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-14', 'politik', 'Published', NULL),
(14, 'Diplomasi Indonesia ke ASEAN Meningkat', 'Indonesia menginisiasi kerja sama regional baru.', 'https://th.bing.com/th/id/OIP.vucgRlpnpBosikhRBZdpywHaEK?w=289&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-11', 'politik', 'Published', NULL),
(15, 'Indonesia Juara SEA Games 2025', 'Timnas meraih medali emas mengalahkan Vietnam.', 'https://th.bing.com/th/id/OIP.6Rk72nrDpFKwVgIHbNwragHaEJ?w=321&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-16', 'olahraga', 'Published', NULL),
(16, 'Piala Dunia: Brasil Tumbang di Semifinal', 'Kekalahan lewat adu penalti lawan Prancis.', 'https://th.bing.com/th/id/OIP.sJ-LanvzB1uMlXa8YD0iTwHaEK?w=279&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-13', 'olahraga', 'Published', NULL),
(17, 'Pebulu Tangkis Muda Raih Gelar Dunia', 'Pemain 18 tahun Indonesia menjuarai All England.', 'https://th.bing.com/th/id/OIP.bFSZE_3rZgtcdU9N9yDeVQHaE6?w=241&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-09', 'olahraga', 'Published', NULL),
(18, 'Film Lokal Tembus Box Office Asia', 'Film drama keluarga sukses besar di Asia.', 'https://th.bing.com/th/id/OIP.29AYkPi5brhDRBIlYcZmcQHaDj?w=335&h=167&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-12', 'hiburan', 'Published', NULL),
(19, 'Konser BTS di Jakarta Pecahkan Rekor', 'Konser BTS mencetak rekor penonton terbanyak.', 'https://th.bing.com/th/id/OIP.hH_Pf-vlslNj45fzzrxFjQHaEK?w=287&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-10', 'hiburan', 'Published', NULL),
(20, 'Festival Musik Bali Sukses Digelar', 'Ribuan penonton nikmati pertunjukan lintas genre.', 'https://th.bing.com/th/id/OIP.9IvwDwQnsm4TfhWY2CVi-QHaE7?w=248&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-06-08', 'hiburan', 'Published', NULL),
(21, 'Kecerdasan Buatan Capai Terobosan Baru di Dunia Medis', 'Para peneliti mengembangkan AI yang mampu mendiagnosis kanker lebih cepat dan akurat dibanding dokter manusia.', 'https://th.bing.com/th/id/OIP.pvh5DGd8C1TmQVdGd47h-AHaHa?w=160&h=160&rs=1&qlt=80&o=6&dpr=1.3&pid=3.1', '2025-07-12', '', 'Published', NULL),
(22, 'Presiden Resmikan Proyek Energi Terbarukan di Kalimantan', 'Proyek ini diharapkan dapat mengurangi ketergantungan Indonesia terhadap bahan bakar fosil.', 'https://th.bing.com/th/id/OIP.ga_X6W2UWQEQsS2yDf8vhgHaEK?w=329&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-07-12', '', 'Published', NULL),
(23, 'test', 'yaw', 'https://th.bing.com/th/id/OIP.qlZdpP6mqqo6o7YIWS0JWQHaE7?w=277&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-07-01', '', 'Draft', NULL),
(25, 'testtttt', 'yaw', 'https://th.bing.com/th/id/OIP.qlZdpP6mqqo6o7YIWS0JWQHaE7?w=277&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', '2025-07-08', 'hiburan', 'Pending', 5),
(27, 'AI Revolutionizes Healthcare', 'zz', 'https://tse1.mm.bing.net/th/id/OIP.HouHLbEs7ycqPzxKj5dKDwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3', '2025-07-13', 'teknologi', 'Draft', 5);

-- --------------------------------------------------------

--
-- Table structure for table `news_likes`
--

CREATE TABLE `news_likes` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `newsId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `reporterId` int(11) NOT NULL,
  `targetType` enum('news','comment') NOT NULL,
  `targetId` int(11) NOT NULL,
  `reason` text NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `about` text DEFAULT NULL,
  `role` enum('admin','author','reader') DEFAULT 'reader',
  `profileImage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `about`, `role`, `profileImage`) VALUES
(3, 'Muhammad Ziddan Fadillah', 'mziddanfadillah@gmail.com', '$2b$10$wg31rO/JADfnX5z3kYgT/.P8a2IH/f.OjN.N8XbEuvD8I2bLGKf6i', '2025-07-08 09:32:17', 'null', 'reader', '1751967137463-trisaktimuda2022-4d18ed70-23dc-468f-8a16-27f141343db8.jpg'),
(5, 'John Doe', 'johndoe@example.com', '$2b$10$tgoYt2E17ZjMmt2qWiGGM.h5C9EtvpVrS9btdGjE.Jx62r6QWFuli', '2025-07-16 12:23:12', 'Semangat Semangat oke Oke', 'author', '1752668592375-retri.jpeg'),
(7, 'admin', 'admin@example.com', '$2b$10$XQ0.dQMsbxQPRx2LpvjFJuvpj4QH8wh4hntlgS4yGaKDH3FvzemTS', '2025-07-30 16:03:57', 'Men Sana In Corpore Sano', 'admin', '1753891437248-fox-dream-surreal-3840x4477-10657.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `views`
--

CREATE TABLE `views` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_bookmark` (`userId`,`newsId`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newsId` (`newsId`),
  ADD KEY `fk_user` (`userId`);

--
-- Indexes for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`commentId`,`userId`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news_likes`
--
ALTER TABLE `news_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`userId`,`newsId`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reporterId` (`reporterId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_view` (`user_id`,`news_id`),
  ADD KEY `news_id` (`news_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT for table `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `news_likes`
--
ALTER TABLE `news_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `views`
--
ALTER TABLE `views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporterId`) REFERENCES `users` (`id`);

--
-- Constraints for table `views`
--
ALTER TABLE `views`
  ADD CONSTRAINT `views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `views_ibfk_2` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
