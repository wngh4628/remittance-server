# 해외 송금 & 환전 프로젝트 (NestJS)

## 📌 과제 개요
NestJS 기반의 해외 송금 서비스 백엔드 API로, 회원가입부터 송금 접수까지의 기능을 구현했습니다.

회원 가입 API에서는 bcrypt를 이용한 비밀번호 해싱과 주민등록번호 및 사업자등록번호는 AES-256-CBC 암호화를 적용하였습니다.
Authentication은 JWT 기반 인증 시스템을 사용하여, UserGard와 Passport로 검증하고, 사용자 로그인 시 액세스 토큰을 발급하여 요청을 인증합니다.

송금 견적서를 갖고 오는 API는 환율 정보를 외부 API에서 가져와 적용하며,
KRW(원)에서 USD(달러)로 먼저 환전한 후, 사용자가 요청한 목표 통화로 변환하여 계산했습니다.
송금 접수 요청 API는 견적서의 유효 시간(10분)을 검증하고, 개인 및 법인의 송금 한도를 검사한 후 요청을 처리하도록 구현했습니다.

회원의 거래 이력을 조회하는 API는 사용자의 송금 내역을 데이터베이스에서 조회하며, 향후 페이징 기능을 추가할 수 있도록 확장 가능하게 설계하였습니다.
전체 API는 TraceExecution 데코레이터를 활용한 실행 흐름 로깅, WinstonLogger를 이용한 로깅 시스템, AllExceptionsFilter를 통한 글로벌 예외 처리를 적용하여 안정성과 가시성을 높였습니다. 🚀


## 🚀 기술 스택
- **프로그래밍 언어**: TypeScript 5.4+
- **프레임워크**: NestJS 10.4.2
- **데이터베이스**: MySQL(Docker 설정)
- **ORM**: TypeORM
- **런타임 환경**: Node.js 22
- **단위 테스트**: @nestjs/testing
- **빌드 및 패키지 매니저**: Yarn



## 📁 프로젝트 구조
```
.
├── src
│   ├── core           # 공통 유틸리티 및 데코레이터
│   ├── domains        # 도메인별 모듈 (User, Transfer 등)
│   ├── main.ts        # 애플리케이션 엔트리 포인트
│   └── app.module.ts  # 최상위 모듈
├── test               # 단위 테스트 코드
├── package.json       # 프로젝트 의존성 및 실행 스크립트
├── README.md          # 프로젝트 설명서
```



## 🔧 실행 방법
### 1️⃣ **로컬 개발 환경 실행**
```sh
yarn install       # 의존성 설치
yarn dev           # Dev 서버 실행 (http://localhost:9006)
yarn start         # Prod 서버 실행
yarn test          # 전체 테스트
```


### 2️⃣ **MySQL Docker 이미지 실행**
```sh
같이 동봉된 moin_mysql.tar 압축 파일이 위치한 디렉토리에서
압축 풀기: docker load -i moin_mysql.tar
실행: docker run -d --name moin_mysql -p 3306:3306 moin_mysql
```



### 3️⃣ **테스트 실행**
```sh
yarn test         # 모든 단위 테스트 실행
* 데이터 베이스에 데이터가 없을 시, 몇몇 단위 테스트가 통과 안될 수도 있습니다.
* ex -> 견적서가 만료 테스트
```

## 🗄 데이터베이스 스키마 및 인덱스

### 📌 **데이터베이스**
이 프로젝트는 **MySQL**을 사용하며, 다음과 같은 주요 테이블로 구성됩니다.

1. **`user` 테이블**: 회원 정보를 저장
2. **`quote` 테이블**: 송금 견적 정보를 저장
3. **`transfer` 테이블**: 송금 거래 기록을 저장

### 🔹 **테이블 설명 및 인덱스 적용**

#### **1️⃣ `user` 테이블**
- `idx` 컬럼을 **기본 키(PRIMARY KEY)**로 설정
- `user_id`는 **고유한 값(UNIQUE KEY)**으로 설정되어 중복 가입을 방지합니다.

#### **2️⃣ `quote` 테이블**
- `quote_id`는 **기본 키(PRIMARY KEY)**로 설정되었습니다.
- `user_idx`에 **인덱스(INDEX)**를 적용하여 사용자의 견적서를 빠르게 조회할 수 있도록 최적화했습니다.
- `status`와 `expire_time` 컬럼에 **인덱스(INDEX)**를 적용하여 송금 상태 및 만료 여부 조회 속도를 향상시켰습니다.
- `exchange_rate`, `target_amount` 등의 금융 데이터를 저장하는 컬럼은 **decimal 타입(정확한 소수점 연산을 위해)**으로 지정했습니다.

#### **3️⃣ `transfer` 테이블**
- `idx`를 **기본 키(PRIMARY KEY)**로 설정했습니다.
- `quote_id`에 **외래 키(FK) 및 인덱스(INDEX)**를 적용하여 송금 요청과 견적 데이터를 빠르게 연결할 수 있도록 했습니다.
- `user_idx`, `status`, `created_at`에 **복합 인덱스(INDEX)**를 적용하여 사용자의 송금 이력 조회 성능을 최적화했습니다.
- `status` 필드는 `INITIATED, COMPLETED, FAILED, PENDING` 상태를 가지며, **인덱스를 적용**하여 특정 상태의 송금 요청을 빠르게 조회할 수 있습니다.
- `transfer.quote_id` → `quote.quote_id` 관계를 설정하여 **송금 요청과 견적서 데이터를 연결**했습니다.


## 📝 API 문서 (Swagger 설정)
NestJS의 Swagger 모듈을 활용하여 API 문서를 자동 생성합니다.
Swagger UI를 통해 API를 테스트할 수 있으며, 
어플리케이션을 실행 후, `http://localhost:9006/api-docs` 경로에서 확인 가능합니다.

Swagger UI URL:  
```
http://localhost:9006/api-docs
```


### **Swagger 설정**
- **`swaggerConfig`**: Swagger 문서의 기본 설정을 정의합니다.
- **`initSwagger`**: Swagger 문서를 NestJS 애플리케이션에 적용하는 함수입니다.
- **Swagger 커스텀 데코레이터**:
  - `ApiPostDecorator`: POST API 요청을 위한 공통 Swagger 설정을 적용하는 데코레이터
  - `ApiCreatedResponseTemplate`: 생성 성공 응답을 정의하는 템플릿
  - `ApiOkResponseTemplate`: 200 OK 응답을 정의하는 템플릿
  - `ApiCommonErrorResponseTemplate`: 공통 에러 응답을 정의하는 템플릿
  - `ApiUnauthorizedErrorResponse`: 인증이 필요한 API에서 발생할 수 있는 오류 응답을 정의
  - `ApiErrorResponseTemplate`: 특정 에러 코드에 대한 응답을 설정하는 데코레이터



## 🔑 보안 고려 사항
- **JWT UserGard & Passport**: `Bearer Token` 인증은 UserGard와 Passport를 이용하여 구현했습니다.
- **비밀번호 및 민감 정보 암호화**: 
  - 비밀번호는 **bcrypt**를 이용해 해싱 후 저장됩니다.
  - AES-256-CBC 알고리즘을 이용해 민감 정보를 암호화합니다.
- **로깅 및 트레이싱 시스템 추가**: 
  - TraceExecution 데코레이터를 활용하여 각 서비스의 실행 흐름을 로깅하고 예외 발생 시 상세 정보를 기록합니다.
  - TraceTemplate 패턴을 적용하여 서비스 로직 실행을 감싸고 예외 발생 시 일관된 처리를 수행합니다.
  - AsyncLocalStorage를 활용하여 요청별 traceId를 관리하고, 이를 기반으로 실행 단계를 추적할 수 있도록 구현하였습니다.
  - WinstonLoggerService를 활용하여 다양한 로깅 수준을 적용하고, 콘솔 및 파일 로그를 분리하여 저장합니다.
- **글로벌 예외 처리 (`AllExceptionsFilter`)**:
  - 모든 예외를 `AllExceptionsFilter`에서 중앙 관리하며, 예외 발생 시 상세한 로그를 남깁니다.
  - HTTP 예외 및 내부 서버 오류를 구분하여 적절한 응답을 반환합니다.
  - `WinstonLoggerService`를 이용하여 에러 스택을 로깅하고, 클라이언트에게 표준화된 응답 형식을 제공합니다.



### **송금 견적서 계산법**
견적서(Quote) 생성 시, 다음과 같은 계산법이 적용됩니다:

1. **수수료 계산:**  
   - **USD 송금:**  
     - 100만원 이하: `수수료율 0.2% + 고정 수수료 1000원`  
     - 100만원 초과: `수수료율 0.1% + 고정 수수료 3000원`  
   - **JPY 송금:**  
     - `수수료율 0.5% + 고정 수수료 3000원`  

2. **실제 송금액 계산:**  
   - `보내는 금액 - 수수료 = 최종 변환할 금액`  

3. **환율 적용:**  
   - KRW → USD 환율 적용 (예: `1301.01`)  
   - USD → Target Currency 환율 적용  

4. **최종 수취 금액 계산:**  
   - `수취 금액 = (보내는 금액 - 수수료) / KRW→USD 환율 × USD→TargetCurrency 환율`  

5. **견적서 만료 시간:**  
   - `견적 생성 후 +10분 이내 유효`  



## 📌 검증 결과 및 회고
### ✅ 구현한 사항
- **NestJS 기반 백엔드 API 구축**
- **TypeORM을 활용한 MySQL 연동** (Docker 기반 환경 포함)
- **사용자 인증 및 송금 견적서 계산 기능 구현**
- **로깅 및 트레이싱 기능 추가하여 시스템 가시성 강화**
- **Swagger 기반 API 문서화 및 커스텀 데코레이터를 활용한 자동화된 문서화 지원**
- **전역 예외 처리 (`AllExceptionsFilter`) 적용**
- **단위 테스트 작성 및 검증 진행**

### 🔄 개선할 사항
2. **API 응답 통일성**: 예제의 응답 컨벤션 통일.
3. **페이징 처리 추가**: 거래 내역 조회 API에 페이징 기능 추가 필요. 페이징 가능하도록 페이징 상속 적용

