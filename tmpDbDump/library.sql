-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Авг 25 2016 г., 14:18
-- Версия сервера: 5.7.13-0ubuntu0.16.04.2
-- Версия PHP: 7.0.8-0ubuntu0.16.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `library`
--

-- --------------------------------------------------------

--
-- Структура таблицы `books`
--

CREATE TABLE `books` (
  `book_id` int(10) NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int(4) NOT NULL,
  `cover` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pages` int(4) NOT NULL,
  `ISBN` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `date` date NOT NULL,
  `event` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `books`
--

INSERT INTO `books` (`book_id`, `title`, `author`, `description`, `year`, `cover`, `pages`, `ISBN`, `status`, `date`, `event`) VALUES
(22, 'СИ++ И КОМПЬЮТЕРНАЯ ГРАФИКА', 'Андрей Богуславский', 'Лекции и практикум по программированию на Си++', 2003, '', 351, '', 0, '0000-00-00', NULL),
(23, 'Программирование на языке Go', 'Марк Саммерфильд', 'Разработка приложений XXI века', 2013, '', 580, '', 0, '0000-00-00', NULL),
(24, 'Flash CS5', 'Cтив Джонсон', 'Руководство разработчика', 2012, '', 560, '', 0, '0000-00-00', NULL),
(25, 'Толковый словарь сетевых терминов и аббревиатур', '', 'Официальное издание CISCO Systems', 2001, '', 366, '', 0, '0000-00-00', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `book_id` int(10) NOT NULL,
  `reader_id` int(10) NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `events`
--

CREATE TABLE `events` (
  `event_id` int(10) NOT NULL,
  `book_id` int(10) NOT NULL,
  `reader_id` int(10) NOT NULL,
  `date` date NOT NULL,
  `term` int(2) NOT NULL,
  `pawn` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `queue`
--

CREATE TABLE `queue` (
  `book_id` int(10) NOT NULL,
  `email` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `readers`
--

CREATE TABLE `readers` (
  `reader_id` int(10) NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`),
  ADD KEY `FK_books` (`event`);

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD KEY `book_id` (`book_id`),
  ADD KEY `reader_id` (`reader_id`);

--
-- Индексы таблицы `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `reader_id` (`reader_id`);

--
-- Индексы таблицы `queue`
--
ALTER TABLE `queue`
  ADD KEY `FK_queue` (`book_id`);

--
-- Индексы таблицы `readers`
--
ALTER TABLE `readers`
  ADD PRIMARY KEY (`reader_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT для таблицы `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `readers`
--
ALTER TABLE `readers`
  MODIFY `reader_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `FK_books` FOREIGN KEY (`event`) REFERENCES `events` (`event_id`);

--
-- Ограничения внешнего ключа таблицы `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`reader_id`) REFERENCES `readers` (`reader_id`);

--
-- Ограничения внешнего ключа таблицы `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`reader_id`) REFERENCES `readers` (`reader_id`);

--
-- Ограничения внешнего ключа таблицы `queue`
--
ALTER TABLE `queue`
  ADD CONSTRAINT `FK_queue` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
