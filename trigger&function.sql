-- trigger

CREATE DEFINER=`appuser`@`%` TRIGGER `customer_visit_before_insert` BEFORE INSERT ON `m_customer_visits1` FOR EACH ROW BEGIN
    -- Check if visit_number is null, and set it dynamically
    IF NEW.visit_number IS NULL THEN
        SET NEW.visit_number = get_m_customer_visit_serial_number('mCustomerVisit', get_financial_year(NEW.deleted_at));
    END IF;

END



-- function 



CREATE DEFINER=`appuser`@`%` FUNCTION `uat_universe`.`get_m_customer_visit_serial_number`(
    `s_doc_type` VARCHAR(50),  
    `s_year` INT
) RETURNS varchar(255) CHARSET utf8mb4
    NO SQL
BEGIN 
    DECLARE s_pattern VARCHAR(255);
    DECLARE n_next_seq_num BIGINT;
    DECLARE n_doc_sequence_id BIGINT;
    DECLARE s_pad_with_zeros BOOLEAN;
    DECLARE n_seq_length INT;
    DECLARE s_doc_num VARCHAR(255);
    
    -- Get the document sequence details
    SELECT 
        id,
        REPLACE(REPLACE(REPLACE(pattern, '{{NEXTSEQ}}', ''), '{{FY}}', SUBSTR(s_year, 3, 2)), '{{OUTLET}}', s_outlet_id),
        pad_with_zeroes,
        seq_length
    INTO 
        n_doc_sequence_id, 
        s_pattern, 
        s_pad_with_zeros, 
        n_seq_length
    FROM document_sequences 
    WHERE doc_type = s_doc_type 
    ORDER BY id DESC 
    LIMIT 1;

    -- Update the sequence number
    UPDATE document_sequence_details 
    SET next_seq_num = next_seq_num + 1 
    WHERE document_sequence_id = n_doc_sequence_id 
      AND financial_year = s_year;

    -- Get the next sequence number
    SELECT next_seq_num 
    INTO n_next_seq_num 
    FROM document_sequence_details 
    WHERE document_sequence_id = n_doc_sequence_id 
      AND financial_year = s_year
    ORDER BY id DESC 
    LIMIT 1;
    
    -- Generate the document number with or without padding
    IF s_pad_with_zeros THEN 
        SET s_doc_num = CONCAT(s_pattern, LPAD(n_next_seq_num, n_seq_length, '0'));
    ELSE
        SET s_doc_num = CONCAT(s_pattern, n_next_seq_num);
    END IF;
    
    RETURN s_doc_num;
END

