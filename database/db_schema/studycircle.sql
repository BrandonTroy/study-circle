/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `last_name` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `username` varchar(150) NOT NULL UNIQUE,
  `password` varchar(256) NOT NULL,
  `salt` varchar(256) NOT NULL,
  `avatar` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `user`;
INSERT INTO `user` (`last_name`, `first_name`, `email`, `username`, `password`, `salt`) VALUES
  ('Ce', 'Xufeng', 'xce@ncsu.edu', 'xce', '2803506ef7beff7ed07a730eb94ff8cfc1648e091e64297c03354a6203e504f7469cb529cf5f8b1d7e16496a8cccd64cf08beea8484924666318eb9e44f066ae', 'xce_salt'),
  ('Sarvis', 'Greydon', 'gasarvis@ncsu.edu', 'gasarvis', 'b685798ddeda2d17691c09f87e45265fd20c3700300c20119f2789665cfcb7e0a7302aae616f56e94cf5a3275d0a8336c46ca6878664ed5fa98b2af17680bdfc', 'gasarvis_salt'),
  ('Troy', 'Brandon', 'bjtroy@ncsu.edu', 'bjtroy', '80dafcee176d2ac99b3f3ba63c385f5151dbd8b6830b4dd5a8d2df1cc7db35fd7fd2425d80bee706828d2337c2f703c274cbadf896e506f0f5911436c2292fc2', 'bjtroy_salt'),
  ('Doe', 'John', 'jdoe@ncsu.edu', 'jdoe', '80dafcee176d2ac99b3f3ba63c385f5151dbd8b6830b4dd5a8d2df1cc7db35fd7fd2425d80bee706828d2337c2f703c274cbadf896e506f0f5911436c2292fc2', 'bjtroy_salt'),
  ('Smith', 'Sam', 'ssmith@ncsu.edu', 'ssmith', '80dafcee176d2ac99b3f3ba63c385f5151dbd8b6830b4dd5a8d2df1cc7db35fd7fd2425d80bee706828d2337c2f703c274cbadf896e506f0f5911436c2292fc2', 'bjtroy_salt'),
  ('Sauce', 'Apple', 'asauce@ncsu.edu', 'asauce', '80dafcee176d2ac99b3f3ba63c385f5151dbd8b6830b4dd5a8d2df1cc7db35fd7fd2425d80bee706828d2337c2f703c274cbadf896e506f0f5911436c2292fc2', 'bjtroy_salt'),
  ('Man', 'Bannana', 'bannana@ncsu.edu', 'bannana', '80dafcee176d2ac99b3f3ba63c385f5151dbd8b6830b4dd5a8d2df1cc7db35fd7fd2425d80bee706828d2337c2f703c274cbadf896e506f0f5911436c2292fc2', 'bjtroy_salt');


CREATE TABLE IF NOT EXISTS `chat` (
  `chat_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `chat`;
INSERT INTO `chat` (`chat_id`) VALUES
  (1),
  (2),
  (3),
  (4),
  (5),
  (6),
  (7),
  (8),
  (9),
  (10),
  (11),
  (12),
  (13),
  (14),
  (15),
  (16);


CREATE TABLE IF NOT EXISTS `connection` (
  `sender` int(10) unsigned NOT NULL,
  `recipient` int(10) unsigned NOT NULL,
  `status` boolean DEFAULT FALSE,
  `chat_id` int(10) unsigned DEFAULT NULL,
  `connection_datetime` DATETIME NOT NULL,
  PRIMARY KEY (`sender`, `recipient`),
  CONSTRAINT `FK_SENDER` FOREIGN KEY (`sender`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_RECIPIENT` FOREIGN KEY (`recipient`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_CHAT_CONNECTION` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`chat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `connection`;
INSERT INTO `connection` (`sender`, `recipient`, `status`, `chat_id`, `connection_datetime`) VALUES
  (2, 1, TRUE, 2, '2024-04-20 12:00:00'),
  (2, 3, TRUE, 3, '2024-04-21 12:00:00'),
  (4, 1, TRUE, 4, '2024-04-14 12:00:00'),
  (5, 1, FALSE, NULL, '2024-04-15 12:00:00'),
  (6, 1, FALSE, NULL, '2024-04-16 12:00:00'),
  (7, 1, FALSE, NULL, '2024-04-17 12:00:00'),
  (4, 2, TRUE, 5, '2024-04-11 12:00:00'),
  (5, 2, FALSE, NULL, '2024-04-12 12:00:00'),
  (6, 2, TRUE, 7, '2024-04-13 12:00:00'),
  (7, 2, FALSE, NULL, '2024-04-14 12:00:00'),
  (5, 3, TRUE, 8, '2024-04-12 12:00:00'),
  (6, 3, TRUE, 9, '2024-04-13 12:00:00'),
  (7, 3, FALSE, NULL, '2024-04-14 12:00:00');

CREATE TABLE IF NOT EXISTS `enrollment` (
  `user_id` int(10) unsigned NOT NULL,
  `course_code` varchar(15) NOT NULL,
  PRIMARY KEY (`user_id`, `course_code`),
  CONSTRAINT `FK_USER_ENROLLMENT` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `enrollment`;
INSERT INTO `enrollment` (`user_id`, `course_code`) VALUES
  (3, 'CSC-333-001'),
  (3, 'CSC-342-001'),
  (3, 'CSC-246-001'),
  (3, 'CSC-316-002'),
  (3, 'MA-305-003');

CREATE TABLE IF NOT EXISTS `circle` (
  `circle_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `owner` int(10) unsigned NOT NULL,
  `public` boolean DEFAULT FALSE,
  `chat_id` int(10) unsigned NOT NULL,
  `course_code` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`circle_id`),
  CONSTRAINT `FK_OWNER` FOREIGN KEY (`owner`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_CHAT_CIRCLE` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`chat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `circle`;
INSERT INTO `circle` (`name`, `owner`, `chat_id`, `public`, `course_code`, `description`) VALUES
  ('Study Circle 1', 3, 10, TRUE, 'CSC-333-001', 'This is the first study circle'),
  ('Study Circle 2', 1, 11, TRUE, 'CSC-246-001', NULL),
  ('Study Circle 3', 2, 12, TRUE, 'CSC-246-001', 'This is the third study circle'),
  ('Study Circle 4', 1, 13, TRUE, 'CSC-316-002', NULL),
  ('Study Circle 5', 2, 14, TRUE, 'CSC-342-001', NULL),
  ('The second circle', 3, 15, FALSE, 'MA-305-003', NULL),
  ('The great circle :)', 1, 16, TRUE, NULL, NULL);

CREATE TABLE IF NOT EXISTS `membership` (
  `user_id` int(10) unsigned NOT NULL,
  `circle_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`user_id`, `circle_id`),
  CONSTRAINT `FK_USER_MEMBERSHIP` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_CIRCLE` FOREIGN KEY (`circle_id`) REFERENCES `circle` (`circle_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `membership`;
INSERT INTO `membership` (`user_id`, `circle_id`) VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (1, 2),
  (3, 2),
  (2, 2),
  (1, 3),
  (2, 3),
  (3, 3),
  (1, 4),
  (2, 4),
  (3, 4),
  (1, 5),
  (2, 5),
  (3, 5),
  (1, 6),
  (2, 6),
  (3, 6),
  (1, 7),
  (2, 7),
  (3, 7),
  (4, 1),
  (5, 1),
  (6, 1),
  (7, 1);

CREATE TABLE IF NOT EXISTS `event` (
  `event_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `date` varchar(20) NOT NULL,
  `location` varchar(100) NOT NULL,
  `start_time` varchar(20) NOT NULL,
  `end_time` varchar(20) NOT NULL,
  `circle_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`event_id`),
  CONSTRAINT `FK_CIRCLE_EVENT` FOREIGN KEY (`circle_id`) REFERENCES `circle` (`circle_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `event`;


CREATE TABLE IF NOT EXISTS `message` (
  `message_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `chat_id` int(10) unsigned NOT NULL,
  `content` varchar(1000) NOT NULL,
  `sender_id` int(10) unsigned NOT NULL,
  `send_datetime` DATETIME NOT NULL,
  PRIMARY KEY (`message_id`),
  CONSTRAINT `FK_CHAT_MESSAGE` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`chat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_USER_MESSAGE` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `message`;
INSERT INTO `message` (`chat_id`, `content`, `sender_id`, `send_datetime`) VALUES
  (1, 'Hi chat1', 3, '2024-03-20 12:00:00'),
  (2, 'Hello chat2', 1, '2024-04-01 12:00:00'),
  (2, 'Hi chat2', 2, '2024-04-02 12:00:00'),
  (3, 'How is it going?', 2, '2024-04-04 12:00:00'),
  (3, 'It is going very well, wbu?', 2, '2024-04-04 12:00:00'),
  (3, 'This is a very very very very very very very very very very very very very very very very very very very very long message', 3, '2024-04-04 12:00:00'),
  (10, 'Hello chat10', 1, '2024-05-01 12:00:00'),
  (10, 'Hi chat10', 2, '2024-05-02 12:00:00'),
  (10, 'How are you?', 3, '2024-05-03 12:00:00'),
  (10, 'I am doing great!', 4, '2024-05-04 12:00:00'),
  (10, 'This is an interesting conversation', 5, '2024-05-05 12:00:00'),
  (10, 'I agree!', 6, '2024-05-06 12:00:00'),
  (10, 'Lets keep chatting!', 7, '2024-05-07 12:00:00');
  


/* Add the latest_message_id field while avoiding circular dependency */
ALTER TABLE `chat`
ADD COLUMN `latest_message_id` int(10) unsigned DEFAULT NULL,
ADD CONSTRAINT `FK_MESSAGE_CHAT` FOREIGN KEY (`latest_message_id`) REFERENCES `message` (`message_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/* Set the latest message for the chats */
UPDATE `chat`
SET `latest_message_id` = (
  SELECT MAX(`message_id`) 
  FROM `message` 
  WHERE `chat`.`chat_id` = `message`.`chat_id`
);


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;