package com.educonnect.discussion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import java.util.TimeZone;

@SpringBootApplication
@EnableJpaRepositories
@EnableTransactionManagement
public class EduConnectDiscussionServiceApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Dhaka"));
		SpringApplication.run(EduConnectDiscussionServiceApplication.class, args);
	}

}
